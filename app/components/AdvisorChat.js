"use client";

import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  "Which one should I start with this week?",
  "What if my budget is tighter — can I drop one?",
  "How long until I'd see results from these?",
  "Are there any I should swap out?",
];

const TURN_LIMIT = 15;

export default function AdvisorChat({ picks }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const limitReached = userTurns >= TURN_LIMIT;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || streaming || limitReached) return;
    setError(null);

    let answers = {};
    try {
      const stored = sessionStorage.getItem("quizAnswers");
      if (stored) answers = JSON.parse(stored);
    } catch {}

    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: newMessages, answers, picks }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        if (res.status === 429) {
          setError(
            "You've reached the question limit. Start a fresh chat to keep going."
          );
        } else {
          setError(
            "Sorry — the adviser is unreachable right now. Try again in a moment."
          );
        }
        setMessages((curr) => curr.slice(0, -1));
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((curr) => {
          const copy = [...curr];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Connection lost — try sending again.");
        setMessages((curr) => curr.slice(0, -1));
      }
    } finally {
      setStreaming(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const reset = () => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setInput("");
    setStreaming(false);
    setError(null);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            ✦
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">
              Ask the AI adviser
            </h2>
            <p className="text-sm text-slate-600">
              Got a question about your shortlist? Ask away — the adviser knows
              your answers and your picks.
            </p>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="px-6 py-6 max-h-[420px] overflow-y-auto space-y-4"
      >
        {messages.length === 0 ? (
          <div>
            <p className="text-sm text-slate-500 mb-3">
              Try one of these to get started:
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  disabled={streaming || limitReached}
                  className="text-left text-sm bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl px-4 py-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-900"
                }`}
              >
                {m.content || (
                  <span className="inline-flex gap-1 items-center text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </span>
                )}
              </div>
            </div>
          ))
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 px-6 py-4 bg-slate-50">
        {limitReached ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              You&apos;ve used all {TURN_LIMIT} questions. Want a fresh chat?
            </p>
            <button
              onClick={reset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full text-sm"
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
              disabled={streaming}
              className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-full text-sm"
            >
              Send
            </button>
          </form>
        )}
        <p className="text-xs text-slate-400 mt-2 text-center">
          {userTurns} of {TURN_LIMIT} questions used
        </p>
      </div>
    </section>
  );
}