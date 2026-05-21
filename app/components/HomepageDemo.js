"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DEMOS = [
  {
    key: "retail",
    emoji: "🛍️",
    label: "Retail",
    persona: "Small high-street boutique",
    walkthrough:
      "Two things eat your week — chasing card payments at the till and tracking stock by hand. Start with Tallyhive for finances and Tappay for card payments. This week, open a Tallyhive trial and link your bank.",
    tools: [
      { mono: "TH", name: "Tallyhive", tag: "Accounting", price: "Free", monoBg: "bg-green-100", monoText: "text-green-700" },
      { mono: "TP", name: "Tappay", tag: "Card payments", price: "Free", monoBg: "bg-orange-100", monoText: "text-orange-700" },
      { mono: "TB", name: "TillBox Retail", tag: "POS & stock", price: "Low", monoBg: "bg-slate-900", monoText: "text-white" },
    ],
    timeline: [
      { tag: "W1", title: "Get the money flowing", tool: "Tallyhive" },
      { tag: "M1", title: "Take cards smoothly", tool: "Tappay" },
      { tag: "Q1", title: "Stock visibility, finally", tool: "TillBox Retail" },
    ],
    cost: "£0 first month, then ~£25/mo",
    accent: "from-blue-500 to-purple-500",
  },
  {
    key: "hospitality",
    emoji: "🍽️",
    label: "Hospitality",
    persona: "Solo café owner",
    walkthrough:
      "You're customer-facing all day — every minute on admin is a minute off the floor. Start with Tallyhive for VAT and DesignDeck for marketing. This week, get Tallyhive linked to your bank.",
    tools: [
      { mono: "TH", name: "Tallyhive", tag: "Accounting", price: "Free", monoBg: "bg-green-100", monoText: "text-green-700" },
      { mono: "DD", name: "DesignDeck", tag: "Marketing", price: "Free", monoBg: "bg-purple-100", monoText: "text-purple-700" },
      { mono: "SW", name: "Sitewright", tag: "Website", price: "Free", monoBg: "bg-slate-900", monoText: "text-white" },
    ],
    timeline: [
      { tag: "W1", title: "Sort VAT and books", tool: "Tallyhive" },
      { tag: "M1", title: "Promote your café", tool: "DesignDeck" },
      { tag: "Q1", title: "Build a basic website", tool: "Sitewright" },
    ],
    cost: "£0 first month, then ~£0–20/mo",
    accent: "from-orange-500 to-rose-500",
  },
  {
    key: "trades",
    emoji: "🔧",
    label: "Trades",
    persona: "2-person plumbing firm",
    walkthrough:
      "Quoting and invoicing from the van eats your evenings. Start with JobBoxx for jobs and Nudgepay for late payments. This week, load JobBoxx with your last 5 quotes.",
    tools: [
      { mono: "JB", name: "JobBoxx", tag: "Job management", price: "Low", monoBg: "bg-blue-100", monoText: "text-blue-700" },
      { mono: "TH", name: "Tallyhive", tag: "Accounting", price: "Free", monoBg: "bg-green-100", monoText: "text-green-700" },
      { mono: "NP", name: "Nudgepay", tag: "Invoice chasing", price: "Low", monoBg: "bg-amber-100", monoText: "text-amber-700" },
    ],
    timeline: [
      { tag: "W1", title: "Quote from the van", tool: "JobBoxx" },
      { tag: "M1", title: "Tighten the books", tool: "Tallyhive" },
      { tag: "Q1", title: "Stop chasing late payments", tool: "Nudgepay" },
    ],
    cost: "£0 first month, then ~£35/mo",
    accent: "from-emerald-500 to-blue-500",
  },
  {
    key: "services",
    emoji: "💼",
    label: "Professional services",
    persona: "Solo consultant",
    walkthrough:
      "You bill by the hour but spend half your time on admin. Start with Tallyhive for invoicing and DesignDeck for the brand. This week, send your first Tallyhive invoice.",
    tools: [
      { mono: "TH", name: "Tallyhive", tag: "Accounting", price: "Free", monoBg: "bg-green-100", monoText: "text-green-700" },
      { mono: "DD", name: "DesignDeck", tag: "Branding", price: "Free", monoBg: "bg-purple-100", monoText: "text-purple-700" },
      { mono: "SF", name: "Studioframe", tag: "Website", price: "Low", monoBg: "bg-slate-900", monoText: "text-white" },
    ],
    timeline: [
      { tag: "W1", title: "Send pro invoices", tool: "Tallyhive" },
      { tag: "M1", title: "Sharpen your brand", tool: "DesignDeck" },
      { tag: "Q1", title: "Look the part online", tool: "Studioframe" },
    ],
    cost: "£0 first month, then ~£15/mo",
    accent: "from-indigo-500 to-blue-500",
  },
  {
    key: "online",
    emoji: "💻",
    label: "Online & e-commerce",
    persona: "Online seller going independent",
    walkthrough:
      "You need a proper shopfront and a way to keep buyers coming back. Start with Sitewright for the site and InboxBird for repeat customers. This week, claim your domain on Sitewright.",
    tools: [
      { mono: "SW", name: "Sitewright", tag: "Website + shop", price: "Free", monoBg: "bg-slate-900", monoText: "text-white" },
      { mono: "IB", name: "InboxBird", tag: "Email marketing", price: "Free", monoBg: "bg-yellow-100", monoText: "text-yellow-700" },
      { mono: "CC", name: "CardCub", tag: "Payments", price: "Free", monoBg: "bg-blue-100", monoText: "text-blue-700" },
    ],
    timeline: [
      { tag: "W1", title: "Get your shop online", tool: "Sitewright" },
      { tag: "M1", title: "Bring buyers back", tool: "InboxBird" },
      { tag: "Q1", title: "Take payments globally", tool: "CardCub" },
    ],
    cost: "£0 first month, then ~£15/mo",
    accent: "from-pink-500 to-purple-500",
  },
];

const CYCLE_MS = 6000;

export default function HomepageDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % DEMOS.length);
      setFadeKey((k) => k + 1);
    }, CYCLE_MS);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  function pickIndustry(idx) {
    setActiveIdx(idx);
    setFadeKey((k) => k + 1);
    setPaused(true);
  }

  const demo = DEMOS[activeIdx];

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white px-6 py-16 sm:py-24 border-y border-slate-100">
      <style>{`
        @keyframes rt-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rt-fade { animation: rt-fade-in 0.4s ease-out; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Live demo · sample output
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Pick an industry — see what you&apos;d get.
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Click an industry below to preview a sample shortlist and 90-day plan.
            The real one is built around <em>your</em> answers, not someone
            else&apos;s.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {DEMOS.map((d, idx) => {
            const active = idx === activeIdx;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => pickIndustry(idx)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border-2 transition ${
                  active
                    ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
              >
                <span className="text-base">{d.emoji}</span>
                {d.label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-white border-2 border-amber-300 text-amber-800 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
            Sample preview · not a real result
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
              <div className="flex-1 mx-4 bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-500 font-mono truncate">
                righttech.online/results · {demo.persona}
              </div>
            </div>

            <div key={fadeKey} className="p-6 sm:p-10 rt-fade">
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
                      Your shortlist
                    </span>
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      {demo.emoji} {demo.label}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3">
                    Here&apos;s what we&apos;d start with.
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-5">
                    {demo.walkthrough}
                  </p>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-5">
                    <p className="text-[10px] font-bold tracking-widest text-emerald-700 uppercase">
                      All-in cost
                    </p>
                    <p className="font-bold text-slate-900">{demo.cost}</p>
                  </div>

                  <div className="space-y-2">
                    {demo.tools.map((t) => (
                      <div
                        key={t.name}
                        className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg ${t.monoBg} ${t.monoText} flex items-center justify-center font-bold text-sm shrink-0`}
                        >
                          {t.mono}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm">
                            {t.name}
                          </p>
                          <p className="text-xs text-slate-500">{t.tag}</p>
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            t.price === "Free"
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {t.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-3">
                    90-day plan
                  </p>
                  <div className="space-y-1">
                    {demo.timeline.map((s, i) => (
                      <div key={s.tag} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-br ${demo.accent} text-white font-bold text-xs flex items-center justify-center shadow-sm`}
                          >
                            {s.tag}
                          </div>
                          {i < demo.timeline.length - 1 && (
                            <div className="w-0.5 flex-1 bg-slate-200 mt-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-semibold text-slate-900 text-sm">
                            {s.title}
                          </p>
                          <span className="inline-block mt-1 bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded">
                            {s.tool}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                {paused
                  ? "Paused — click another industry to swap."
                  : `Auto-cycling every ${CYCLE_MS / 1000}s · click any industry to take over`}
              </p>
              <Link
                href="/quiz"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-full"
              >
                Get my real plan →
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-5">
            {DEMOS.map((d, idx) => (
              <button
                key={d.key}
                type="button"
                onClick={() => pickIndustry(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeIdx
                    ? "bg-slate-900 w-8"
                    : "bg-slate-300 w-1.5 hover:bg-slate-400"
                }`}
                aria-label={`Show ${d.label} demo`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
