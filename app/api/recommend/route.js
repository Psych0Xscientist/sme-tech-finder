export const runtime = "nodejs";

export async function POST(request) {
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

    const userContext = `
Business size: ${answers.size || "unknown"}
Industry: ${answers.industry || "unknown"}
Tech comfort: ${answers["tech-comfort"] || "unknown"}
Biggest pains: ${(answers["biggest-pain"] || []).join(", ") || "none stated"}
Where time goes: ${answers["where-time-goes"] || "unknown"}
Current stack: ${(answers["current-stack"] || []).join(", ") || "none"}
Growth stage: ${answers["growth-stage"] || "unknown"}
Budget: ${answers.budget || "unknown"}
Decision style: ${answers["decision-style"] || "unknown"}
Biggest win wanted: ${answers["biggest-win"] || "unknown"}
`.trim();

    const toolList = (picks || [])
      .map((p) => `- ${p.name} (${p.category}, ${p.priceTier}): ${p.description}`)
      .join("\n");

    const messages = [
      {
        role: "system",
        content:
          "You are a friendly UK small-business technology adviser helping SME owner-managers pick the right tools. Be warm, jargon-free, specific. Use plain English and UK spelling. Focus on pains and outcomes, not features. NEVER apologise for or comment on missing data — confidently work with whatever you are given. Never say 'some info didn't come through' or similar — just answer.",
      },
      {
        role: "user",
        content: `Here is what I told you about my business:\n\n${userContext}\n\nThe quiz recommended these tools:\n\n${toolList}\n\nIn 3 short paragraphs:\n1. What you noticed about my situation.\n2. The 2 most important tools to start with and why.\n3. One simple first step I can take this week.\n\nWarm, practical, plain English, under 220 words total. Do not preface with hedges or caveats.`,
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
        max_completion_tokens: 600,
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
    const text = data.choices?.[0]?.message?.content || "";

    return Response.json({ text });
  } catch (e) {
    console.error("Recommend route error:", e);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}