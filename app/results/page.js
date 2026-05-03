"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { scoreTools, topPicks, costSummary } from "../scoring";

const TIMELINE_COLOURS = {
  W1: "bg-blue-600",
  M1: "bg-blue-500",
  Q1: "bg-blue-400",
  "+": "bg-slate-300",
};

export default function Results() {
  const [picks, setPicks] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [prose, setProse] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [prep, setPrep] = useState([]);
  const [aiStatus, setAiStatus] = useState("idle"); // idle | loading | ready | error

  useEffect(() => {
    const raw = sessionStorage.getItem("quizAnswers");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    setAnswers(parsed);
    const scored = scoreTools(parsed);
    setPicks(topPicks(scored, { maxTotal: 8, maxPerCategory: 2 }));
  }, []);

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
        if (data.error) {
          setAiStatus("error");
          return;
        }
        setProse(data.prose || "");
        setTimeline(Array.isArray(data.timeline) ? data.timeline : []);
        setPrep(Array.isArray(data.prep) ? data.prep : []);
        setAiStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setAiStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [picks, answers]);

  function printPlan() {
    if (typeof window !== "undefined") window.print();
  }

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
            Try the quiz again — pick a few different pain points so we have more
            to work with.
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

  const industryLabel = answers?.industry?.label;
  const cost = costSummary(picks);

  return (
    <div className="bg-slate-50 min-h-screen">
      <nav className="bg-white border-b border-slate-100 print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#2563eb"/>
                <path d="M9 16.5L14 21.5L23 11.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold text-xl text-slate-900">
            Right<span className="text-blue-600">Tech</span>
            </span>
          </Link>
          <Link
            href="/quiz"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← Retake the quiz
          </Link>
        </div>
      </nav>

      <main className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase">
              Your shortlist
            </p>
            {industryLabel && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                {industryLabel}
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-3">
            Here&apos;s what we&apos;d start with.
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl">
            {picks.length} tools picked to match your business — your size, budget,
            industry and the pain points you told us about. Click through to learn
            more, no sign-up needed.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10 print:hidden">
            <button
              type="button"
              onClick={printPlan}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-full text-sm"
            >
              🖨️ Print / Save as PDF
            </button>
            <span className="text-xs text-slate-500">
              No email or sign-up — your shortlist is saved in this browser.
            </span>
          </div>

          {/* AI walk-through */}
          {aiStatus !== "idle" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase">
                  Your personal walk-through
                </p>
              </div>
              {aiStatus === "loading" && (
                <p className="text-slate-500 italic">
                  Our AI adviser is reading your answers…
                </p>
              )}
              {aiStatus === "ready" && (
                <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {prose}
                </div>
              )}
              {aiStatus === "error" && (
                <p className="text-slate-500 italic">
                  Couldn&apos;t reach the AI adviser just now — your shortlist
                  below is still spot on.
                </p>
              )}
            </div>
          )}

          {/* Cost banner */}
          <div className="mb-6">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-emerald-700 uppercase mb-1">
                    Your stack — all-in cost
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {cost.headline}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{cost.blurb}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{cost.breakdown}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prep card */}
          {aiStatus === "ready" && prep.length > 0 && (
            <div className="mb-12">
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                    📋
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">
                      Before you start (Step 0)
                    </p>
                    <h3 className="font-bold text-slate-900 mb-2">
                      Things to have on hand
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      No rush — just gather these so Week 1 is smooth:
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-700">
                      {prep.map((p, i) => (
                        <li key={i}>· {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 90-day timeline */}
          {aiStatus === "ready" && timeline.length > 0 && (
            <div className="mb-14">
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Your 90-day plan
                </h2>
                <p className="text-slate-600 mb-8">
                  A simple, sequenced rollout — so you don&apos;t try to do it all
                  in one weekend.
                </p>

                <div className="space-y-6">
                  {timeline.map((step, idx) => {
                    const colour = TIMELINE_COLOURS[step.when] || "bg-slate-300";
                    const last = idx === timeline.length - 1;
                    return (
                      <div key={idx} className="flex gap-5">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full ${colour} text-white font-bold text-sm flex items-center justify-center shadow-md`}
                          >
                            {step.when}
                          </div>
                          {!last && (
                            <div className="w-0.5 flex-1 bg-blue-200 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-1">
                            {step.heading}
                          </p>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">
                            {step.title}
                          </h3>
                          <p className="text-slate-600 mb-3">{step.body}</p>
                          {Array.isArray(step.tools) && step.tools.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {step.tools.map((t, i) => (
                                <span
                                  key={i}
                                  className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Your shortlist in detail
          </h2>
          <p className="text-slate-600 mb-6">Grouped by what they fix.</p>

          {Object.entries(groups).map(([category, items]) => (
            <div key={category} className="mb-8">
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-3">
                {category}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {items.map(({ tool, reasons }) => (
                  <ToolCard key={tool.name} tool={tool} reasons={reasons} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-100 px-6 py-8 mt-12 bg-white print:hidden">
        <div className="max-w-5xl mx-auto text-center text-sm text-slate-500">
          <p>© 2026 RightTech · A portfolio project by Sam Mortimer</p>
        </div>
      </footer>
    </div>
  );
}

function ToolCard({ tool, reasons }) {
  const priceClass =
    tool.priceTier === "Free"
      ? "bg-green-100 text-green-800"
      : tool.priceTier === "Low"
      ? "bg-blue-100 text-blue-800"
      : tool.priceTier === "Mid"
      ? "bg-amber-100 text-amber-800"
      : "bg-purple-100 text-purple-800";

  const monogram = tool.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg shrink-0">
          {monogram}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900">{tool.name}</p>
          <p className="text-xs text-slate-500">{tool.category}</p>
        </div>
        <span
          className={`text-xs ${priceClass} font-semibold px-2 py-1 rounded-full self-start`}
        >
          {tool.priceTier}
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-3">{tool.description}</p>

      {tool.ukSpecific && (
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold px-2 py-0.5 rounded">
            🇬🇧 UK-specific
          </span>
        </div>
      )}

      {reasons && reasons.length > 0 && (
        <p className="text-xs text-slate-500 italic mb-3">
          Why this fits: {reasons.join(" · ")}
        </p>
      )}

      <div className="pt-3 border-t border-slate-100">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm font-semibold"
        >
          Visit {tool.name} →
        </a>
      </div>
    </div>
  );
}