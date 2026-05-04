"use client";

import { useEffect, useRef, useState } from "react";

const TURN_LIMIT = 15;

const SUGGESTIONS = [
  "Which one should I start with this week?",
  "What if my budget is tighter — can I drop one?",
  "How long until I'd see results from these?",
  "Are there any I should swap out?",
];

export default function AdvisorChat({ picks }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState(null);
  const messagesEndRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("quizAnswers");
    if (raw) {
      try {
        setAnswers(JSON.parse(raw));
      } catch (e) {
        // ignore
      }
    }
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const limitReached = userTurns >= TURN_LIMIT;

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed || loading || limitReached) return;

    setError("");
    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, answers, picks }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "";

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      if (e.name !== "AbortError") {
        setError("Sorry — the adviser is unreachable right now. Try again in a moment.");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function reset() {
    setMessages([]);
    setError("");
    setInput("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    send(input);
  }

  const showSuggestions = messages.length === 0 && !loading;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Ask the AI adviser</h3>
            <p className="text-xs text-slate-600">Got a question about your shortlist? Ask away — the adviser knows your answers and your picks.</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-h-[420px] overflow-y-auto">
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 mb-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-2 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-slate-100 text-slate-800 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-500 px-4 py-3 rounded-2xl rounded-bl-sm">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-slate-100 p-4">
        {limitReached ? (
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-2">You&apos;ve used all {TURN_LIMIT} questions.</p>
            <button
              type="button"
              onClick={reset}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full"
            >
              Start fresh
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your shortlist…"
              disabled={loading}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full text-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        )}
        <p className="text-center text-xs text-slate-400 mt-2">
          {userTurns} of {TURN_LIMIT} questions used
        </p>
      </div>
    </div>
  );
}