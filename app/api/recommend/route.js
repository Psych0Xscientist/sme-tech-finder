export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TURN_LIMIT = 15;

export async function POST(request) {
  try {
    const { messages, answers, picks } = await request.json();

    const endpoint = process.env.AZURE_AI_ENDPOINT;
    const key = process.env.AZURE_AI_KEY;
    const deployment = process.env.AZURE_AI_DEPLOYMENT;

    if (!endpoint || !key || !deployment) {
      return Response.json({ error: "AI not configured" }, { status: 500 });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "messages array required" }, { status: 400 });
    }

    const userTurns = messages.filter((m) => m.role === "user").length;
    if (userTurns > TURN_LIMIT) {
      return Response.json(
        { error: `You've reached the ${TURN_LIMIT}-question limit. Start fresh to keep going.` },
        { status: 429 }
      );
    }

    const systemPrompt = buildSystemPrompt(answers, picks);

    const aiResp = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": key,
      },
      body: JSON.stringify({
        model: deployment,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_completion_tokens: 600,
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("Foundry chat error:", aiResp.status, errText);
      return Response.json(
        { error: "AI request failed", detail: errText },
        { status: 500 }
      );
    }

    const data = await aiResp.json();
    const reply = data.choices?.[0]?.message?.content || "";

    return Response.json({ reply });
  } catch (e) {
    console.error("Chat route error:", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

function buildSystemPrompt(answers, picks) {
  const single = (k) => answers?.[k]?.label || "unknown";
  const multi = (k) => {
    const arr = answers?.[k];
    if (!Array.isArray(arr) || arr.length === 0) return "none stated";
    return arr.map((o) => o.label).join(", ");
  };

  const userContext = answers
    ? `
Business size: ${single("size")}
Industry: ${single("industry")}
Tech comfort: ${single("tech-comfort")}
Biggest pains: ${multi("biggest-pain")}
Where time goes: ${single("where-time-goes")}
Current stack: ${multi("current-stack")}
Growth stage: ${single("growth-stage")}
Budget: ${single("budget")}
Decision style: ${single("decision-style")}
Biggest win wanted: ${single("biggest-win")}
`.trim()
    : "(no quiz answers available)";

  const toolList =
    (picks || [])
      .map(
        (p) =>
          `- ${p.name} (${p.category}, ${p.priceTier}): ${p.description}`
      )
      .join("\n") || "(no shortlist available)";

  return `You are RightTech's friendly UK small-business technology adviser. The user has just been given a shortlist of tools and may ask follow-up questions about it.

USER'S BUSINESS:
${userContext}

USER'S SHORTLIST:
${toolList}

GROUND RULES:
- Stay grounded in the user's situation and the tools on their shortlist. Don't invent tools that aren't on it.
- Be warm, jargon-free, specific. UK English and UK spelling.
- Keep replies short and practical — under 150 words unless they explicitly ask for more detail.
- Never apologise for missing data or add hedging caveats. Confidently use what you have.
- If they ask "which one first" or similar, give a specific recommendation and explain why in plain language.
- If they ask about a tool not on their shortlist, briefly note it but steer back to what they have.
- Plain prose. No markdown headers, no code blocks. The occasional dash list is fine.`;
}