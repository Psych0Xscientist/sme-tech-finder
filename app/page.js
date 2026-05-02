import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-6">
      <div className="max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-4">
          For UK small businesses
        </p>

        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight mb-6">
          The right tech, without the headache.
        </h1>

        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
          Answer 10 quick questions about your business and the bits that
          drive you mad. We&apos;ll recommend a handful of tools that actually
          fit — no jargon, no 50-tab spreadsheets, no sales calls.
        </p>

        <Link
          href="/quiz"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-10 py-4 rounded-full shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
        >
          Start — takes 3 minutes
        </Link>

        <p className="text-sm text-slate-500 mt-6">
          Free · No sign-up · Built by a human, not a sales team
        </p>
      </div>
    </main>
  );
}