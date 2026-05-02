"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "../questions";

export default function Quiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;
  const current = answers[q.id];

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
      if (q.max && existing.length >= q.max) return;
      updated = [...existing, option];
    }
    setAnswers({ ...answers, [q.id]: updated });
  }

  function goNext(nextAnswers = answers) {
    if (step === questions.length - 1) {
      sessionStorage.setItem("quizAnswers", JSON.stringify(nextAnswers));
      router.push("/results");
    } else {
      setStep(step + 1);
    }
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  const isMulti = q.type === "multi";
  const canContinue = isMulti
    ? Array.isArray(current) && current.length > 0
    : !!current;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Question {step + 1} of {questions.length}</span>
            <button
              onClick={goBack}
              disabled={step === 0}
              className="text-blue-600 hover:underline disabled:text-slate-300 disabled:no-underline"
            >
              ← Back
            </button>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{q.title}</h2>
        {q.subtitle && (
          <p className="text-slate-600 mb-8">{q.subtitle}</p>
        )}

        {/* Options */}
        <div className="space-y-3 mb-8">
          {q.options.map((option, idx) => {
            const selected = isMulti
              ? Array.isArray(current) && current.find((o) => o.value === option.value)
              : current && current.value === option.value;
            return (
              <button
                key={idx}
                onClick={() => isMulti ? toggleMulti(option) : pickSingle(option)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                  selected
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                }`}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Continue button (multi-select only) */}
        {isMulti && (
          <button
            onClick={() => goNext()}
            disabled={!canContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-lg py-4 rounded-full shadow-lg shadow-blue-600/25 transition-all"
          >
            {step === questions.length - 1 ? "See my recommendations →" : "Continue →"}
          </button>
        )}
      </div>
    </main>
  );
}