import { checkRateLimit } from "../../lib/rate-limit";
import { validateAnswers } from "../../lib/answer-schema";

export const runtime = "nodejs";

export async function POST(request) {
    const limit = checkRateLimit(request);
    if (!limit.ok) {
    return new Response(
      JSON.stringify({
        error: "Too many requests. Try again in a few minutes.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(limit.retryAfter),
        },
      }
    );
    }
    try {
    const { answers, picks } = await request.json();

    const endpoint = process.env.AZURE_AI_ENDPOINT;
    const key = process.env.AZURE_AI_KEY;
    const deployment = process.env.AZURE_AI_DEPLOYMENT;

    if (!endpoint || !key || !deployment) {
      return Response.json(
        { error: "AI is not configured on the server." },
        { status: 500 }
      );
    }

    // Helpers — answers store full option objects {label, value, tags}.
    const single = (key) => answers?.[key]?.label || "unknown";
    const multi = (key) => {
      const arr = answers?.[key];
      if (!Array.isArray(arr) || arr.length === 0) return "none stated";
      return arr.map((o) => o.label).join(", ");
    };

    const userContext = `
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
`.trim();

    const toolList = (picks || [])
      .map(
        (p) =>
          `- ${p.name} (${p.category}, ${p.priceTier}): ${p.description}`
      )
      .join("\n");

    const toolNames = (picks || []).map((p) => p.name);

    const messages = [
      {
        role: "system",
        content:
          "You are a friendly UK small-business technology adviser helping SME owner-managers pick the right tools. Be warm, jargon-free, specific. Use plain English and UK spelling. Focus on pains and outcomes, not features. NEVER apologise for or comment on missing data — confidently work with whatever you are given. Never say 'some info didn't come through' or similar. Always respond with a single JSON object matching the requested schema. No markdown, no code fences, no commentary outside the JSON.",
      },
      {
        role: "user",
        content: `Here is what I told you about my business:

${userContext}

The quiz recommended these tools:

${toolList}

Respond with a JSON object using exactly this schema:

{
  "prose": "3 short warm paragraphs as one string, separated by blank lines (\\n\\n). Para 1: what you noticed about my situation. Para 2: the 2 most important tools to start with and why. Para 3: one simple first step I can take this week. Under 220 words total. UK English. Plain language. No hedges or caveats.",
  "timeline": [
    { "when": "W1", "heading": "This week", "title": "short action title", "body": "1–2 sentences naming the tool(s) and what to do with them", "tools": ["one or two tool names from the list"] },
    { "when": "M1", "heading": "This month", "title": "...", "body": "...", "tools": ["..."] },
    { "when": "Q1", "heading": "This quarter", "title": "...", "body": "...", "tools": ["..."] },
    { "when": "+", "heading": "Beyond Q1", "title": "...", "body": "1–2 sentences naming the remaining tool(s) and when to layer them in", "tools": ["..."] }
  ],
  "prep": ["3 to 5 short practical things to gather before starting (e.g. 'business bank login', 'last 3 months of invoices')"]
}

CRITICAL TIMELINE RULES — read carefully:
- EVERY tool in this list must appear in exactly one step's "tools" array: ${JSON.stringify(toolNames)}.
- No tool may be omitted. No tool may appear in more than one step. Together, the four "tools" arrays must contain every name above, exactly once.
- Distribute by priority and dependency: most urgent / highest-impact tools that tackle the user's biggest stated pain go in W1. Foundational follow-ups go in M1. Growth and visibility tools go in Q1. Lower-priority or "nice to have" tools go in "+".
- Each step should name 1–3 tools. Do NOT leave any step empty (including "+").
- Tool names in "tools" arrays must match the names in the list above EXACTLY (same spelling, same capitalisation).
- The "body" of each step must mention the tools by name and explain what to do with them in plain English.`,
      },
    ];

    const url = `${endpoint}/chat/completions`;

    const aiResp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": key,
      },
      body: JSON.stringify({
        model: deployment,
        messages,
        temperature: 0.7,
        max_completion_tokens: 1200,
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("Foundry error:", aiResp.status, errText);
      return Response.json(
        { error: "AI request failed.", detail: errText },
        { status: 500 }
      );
    }

    const data = await aiResp.json();
    const raw = data.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("AI returned non-JSON:", raw);
      return Response.json(
        { error: "AI response was not valid JSON.", raw },
        { status: 500 }
      );
    }

    return Response.json({
      prose: parsed.prose || "",
      timeline: Array.isArray(parsed.timeline) ? parsed.timeline : [],
      prep: Array.isArray(parsed.prep) ? parsed.prep : [],
    });
  } catch (e) {
    console.error("Recommend route error:", e);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}