"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { scoreTools, topPicks } from "../scoring";

export default function Results() {
  const [picks, setPicks] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [aiText, setAiText] = useState("");
  const [aiStatus, setAiStatus] = useState("idle"); // idle | loading | ready | error

  useEffect(() => {
    const raw = sessionStorage.getItem("quizAnswers");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    setAnswers(parsed);
    const scored = scoreTools(parsed);
    setPicks(topPicks(scored, { maxTotal: 8, maxPerCategory: 2 }));
  }, []);

  // Fetch AI commentary once picks are ready
  useEffect(() => {
    if (!picks || picks.length === 0 || !answers) return;

    let cancelled = false;
    setAiStatus("loading");

    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers,
        picks: picks.map((p) => p.tool),
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.text) {
          setAiText(data.text);
          setAiStatus("ready");
        } else {
          setAiStatus("error");
        }
      })
      .catch(() => {
        if (!cancelled) setAiStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [picks, answers]);

  if (picks === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Crunching your answers…</p>
      </main>
    );
  }

  if (picks.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            We couldn&apos;t find a great match.
          </h1>
          <p className="text-slate-600 mb-6">
            Try the quiz again — pick a few different pain points so we have more to work with.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full"
          >
            Retake the quiz
          </Link>
        </div>
      </main>
    );
  }

  const groups = {};
  for (const p of picks) {
    const cat = p.tool.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(p);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-3">
          Your tech shortlist
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
          {picks.length} tools picked for your business.
        </h1>
        <p className="text-lg text-slate-600 mb-10">
          These match the size, budget, industry and pain points you told us about. Click through to learn more — no sign-up needed.
        </p>

        {/* AI walk-through */}
        {aiStatus !== "idle" && (
          <div className="mb-10 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-3">
              Your personal walk-through
            </p>
            {aiStatus === "loading" && (
              <p className="text-slate-500 italic">
                Our AI adviser is reading your answers…
              </p>
            )}
            {aiStatus === "ready" && (
              <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                {aiText}
              </div>
            )}
            {aiStatus === "error" && (
              <p className="text-slate-500 italic">
                Couldn&apos;t reach the AI adviser just now — your shortlist below is still spot on.
              </p>
            )}
          </div>
        )}

        {Object.entries(groups).map(([category, items]) => (
          <section key={category} className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              {category}
            </h2>
            <div className="space-y-4">
              {items.map(({ tool, reasons }) => (
                <div
                  key={tool.name}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900">
                        {tool.name}
                      </h3>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          tool.priceTier === "Free"
                            ? "bg-green-100 text-green-800"
                            : tool.priceTier === "Low"
                            ? "bg-blue-100 text-blue-800"
                            : tool.priceTier === "Mid"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {tool.priceTier}
                        </span>
                        {tool.ukSpecific && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                            🇬🇧 UK
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-full"
                    >
                      Visit →
                    </a>
                  </div>
                  <p className="text-slate-600 mb-3">{tool.description}</p>
                  {reasons.length > 0 && (
                    <p className="text-sm text-slate-500 italic">
                      Why this fits: {reasons.join(" · ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12 text-center">
          <Link
            href="/quiz"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Retake the quiz
          </Link>
        </div>
      </div>
    </main>
  );
}