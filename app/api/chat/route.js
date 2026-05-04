import { catalog } from "@/app/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TURN_LIMIT = 15;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const { messages, answers, picks } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Bad request", { status: 400 });
  }

  const userTurns = messages.filter((m) => m.role === "user").length;
  if (userTurns > TURN_LIMIT) {
    return new Response("Turn limit reached", { status: 429 });
  }

  const pickedTools = (picks || [])
    .map((p) => {
      const fromCatalog = catalog.find((t) => t.name === (p.name || p));
      return fromCatalog || (typeof p === "object" ? p : null);
    })
    .filter(Boolean);

  const systemPrompt = buildSystemPrompt(answers, pickedTools);

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const key = process.env.AZURE_OPENAI_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion =
    process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

  if (!endpoint || !key || !deployment) {
    return new Response("AI not configured", { status: 500 });
  }

  const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      "api-key": key,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("AI service error", { status: 502 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // skip malformed chunk
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

function buildSystemPrompt(answers, picks) {
  return `You are RightTech's AI adviser, helping a UK SME owner-manager understand their tool shortlist.

THEIR QUIZ ANSWERS:
${formatAnswers(answers)}

THEIR PERSONAL SHORTLIST:
${formatPicks(picks)}

GUARDRAILS — read carefully:
- Only answer questions about this user's recommended tools, their business, or general UK SME software topics.
- If they ask something off-topic (creative writing, weather, news, jokes, world events, coding help), politely redirect: "I'm here to help with your tech shortlist — want to ask about one of your picks?"
- If they ask about specific pricing, niche features, or anything you're not certain of, say so plainly: "I don't have that detail — check the tool's website to confirm."
- Use UK spelling. Plain English. No tech jargon. No long bullet lists.
- Keep replies short — usually 2-4 sentences. The user is busy.
- Be warm and direct. Like a trusted friend who happens to know UK SME software well.`;
}

function formatAnswers(answers) {
  if (!answers || typeof answers !== "object") return "(no answers available)";
  const lines = [];
  for (const [key, value] of Object.entries(answers)) {
    if (Array.isArray(value)) {
      lines.push(
        `- ${key}: ${value.map((v) => v?.label || v).filter(Boolean).join(", ")}`
      );
    } else if (value && typeof value === "object") {
      lines.push(`- ${key}: ${value.label || JSON.stringify(value)}`);
    } else if (value != null) {
      lines.push(`- ${key}: ${value}`);
    }
  }
  return lines.length ? lines.join("\n") : "(no answers available)";
}

function formatPicks(picks) {
  if (!picks || picks.length === 0) return "(no shortlist available)";
  return picks
    .map(
      (t) =>
        `- ${t.name} (${t.category || "tool"}, ${t.priceTier || "?"} price): ${t.description || ""}`
    )
    .join("\n");
}