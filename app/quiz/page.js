"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "../questions";

export default function Quiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = questions[step];
  const total = questions.length;
  const progress = ((step + 1) / total) * 100;
  const current = answers[q.id];

  const isMulti = q.type === "multi";
  const max = q.max ?? Infinity;
  const selectedCount = Array.isArray(current) ? current.length : 0;

  function pickSingle(option) {
    const next = { ...answers, [q.id]: option };
    setAnswers(next);
    setTimeout(() => goNext(next), 200);
  }

  function toggleMulti(option) {
    const existing = Array.isArray(current) ? current : [];
    const isSelected = existing.find((o) => o.value === option.value);
    let updated;
    if (isSelected) {
      updated = existing.filter((o) => o.value !== option.value);
    } else {
      if (existing.length >= max) return;
      updated = [...existing, option];
    }
    setAnswers({ ...answers, [q.id]: updated });
  }

  function goNext(nextAnswers = answers) {
    if (step === total - 1) {
      sessionStorage.setItem("quizAnswers", JSON.stringify(nextAnswers));
      router.push("/results");
    } else {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goBack() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function isOptionSelected(option) {
    if (isMulti) {
      return Array.isArray(current) && !!current.find((o) => o.value === option.value);
    }
    return current && current.value === option.value;
  }

  const canContinue = isMulti
    ? Array.isArray(current) && current.length > 0
    : !!current;

  return (
    <div className="bg-slate-50 min-h-screen">
      <nav className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#2563eb"/>
                <path d="M9 16.5L14 21.5L23 11.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold text-xl text-slate-900">
            Right<span className="text-blue-600">Tech</span>
            </span>
          </Link>
          <p className="text-sm text-slate-500">
            Question <span className="font-semibold text-slate-900">{step + 1}</span>{" "}
            of <span className="font-semibold text-slate-900">{total}</span>
          </p>
        </div>
        <div className="h-1 bg-slate-100">
          <div
            className="h-1 bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </nav>

      <main className="px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-3">
            {q.title}
          </h1>

          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <p className="text-slate-600">
              {q.subtitle || "Pick the answer that fits best."}
            </p>
            {isMulti && q.max && (
              <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 text-sm font-semibold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                {selectedCount} of {q.max} selected
              </span>
            )}
          </div>

          <div className="space-y-3 mb-10">
            {q.options.map((option, idx) => {
              const selected = isOptionSelected(option);
              const atMax =
                isMulti && q.max && !selected && selectedCount >= q.max;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    isMulti
                      ? !atMax && toggleMulti(option)
                      : pickSingle(option)
                  }
                  disabled={atMax}
                  className={`block w-full text-left bg-white border-2 rounded-xl p-5 transition ${
                    selected
                      ? "border-blue-500 ring-2 ring-blue-100"
                      : atMax
                      ? "border-slate-200 opacity-40 cursor-not-allowed"
                      : "border-slate-200 hover:border-slate-300 cursor-pointer"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isMulti ? (
                      <div
                        className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 ${
                          selected ? "bg-blue-600" : "border-2 border-slate-300"
                        }`}
                      >
                        {selected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                          selected
                            ? "border-blue-600 bg-blue-600"
                            : "border-slate-300"
                        }`}
                      >
                        {selected && (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    )}
                    <p className="font-semibold text-slate-900 flex-1">
                      {option.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="text-slate-500 hover:text-slate-900 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Back
            </button>
            {isMulti && (
              <button
                type="button"
                onClick={() => goNext()}
                disabled={!canContinue}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-full"
              >
                {step === total - 1 ? "See my shortlist →" : "Next →"}
              </button>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            You can change any answer before seeing your shortlist.
          </p>
        </div>
      </main>
    </div>
  );
}