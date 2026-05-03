import Link from "next/link";
import HomepageDemo from "./components/HomepageDemo";

export const metadata = {
  title: "RightTech — The right tech, without the headache",
  description:
    "Answer a few plain-English questions. Get a personal shortlist of UK-friendly tools — and a 90-day plan to put them to work.",
};

export default function LandingPage() {
  return (
    <div className="bg-white">
      <nav className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-slate-900">
            Right<span className="text-blue-600">Tech</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/catalog" className="text-slate-600 hover:text-slate-900">
              Catalogue
            </Link>
            <Link href="/how-it-works" className="text-slate-600 hover:text-slate-900">
              How it works
            </Link>
            <Link
              href="/quiz"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full"
            >
              Start the quiz
            </Link>
          </div>
        </div>
      </nav>

      <section className="px-6 py-20 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-4">
            For UK SME owner-managers
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-[1.05] mb-6">
            The right tech,
            <br />
            without the headache.
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Answer a few plain-English questions. Get a personal shortlist of
            UK-friendly tools — and a 90-day plan to put them to work.
          </p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link
              href="/quiz"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-full inline-block"
            >
              Start — takes 3 minutes →
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            No sign-up · no email · 100% free
          </p>
        </div>
      </section>

      <HomepageDemo />

      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-3">
              How it works
            </p>
            <h2 className="text-4xl font-bold text-slate-900">
              From confused to confident in 3 minutes.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                Tell us about your business
              </h3>
              <p className="text-sm text-slate-600">
                No jargon — just your industry, where your time goes, what your pains
                are, and what budget feels comfortable.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                Get a personal shortlist
              </h3>
              <p className="text-sm text-slate-600">
                Tools picked for your size, industry, comfort and budget — with real
                Trustpilot ratings and a total monthly cost.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                Follow your 90-day plan
              </h3>
              <p className="text-sm text-slate-600">
                A week-by-week rollout with expected impact — so you know exactly
                where to start, not just <em>what</em> to buy.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <details className="bg-slate-50 border border-slate-200 rounded-2xl">
              <summary className="cursor-pointer px-6 py-4 font-semibold text-slate-900 hover:bg-slate-100 rounded-2xl flex items-center justify-between">
                <span>Curious how the matching actually works?</span>
                <span className="text-blue-600 text-sm">Open ↓</span>
              </summary>
              <div className="px-6 pb-6 pt-2 text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  Each tool in our catalogue is hand-tagged for size, industry, pain
                  points, comfort level, budget and UK availability. Your answers
                  become a query — and we score every tool, weighted by how strongly
                  each factor mattered.
                </p>
                <p>
                  Free options surface first when fit is tied. The AI adviser then
                  sequences your shortlist into a 90-day rollout, with expected impact
                  estimates sourced from each tool&apos;s published case studies and
                  customer surveys.
                </p>
                <p>
                  <Link
                    href="/how-it-works"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Read the full methodology →
                  </Link>
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-blue-600">50+</p>
              <p className="text-sm text-slate-600 mt-1">tools curated for UK SMEs</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-blue-600">7</p>
              <p className="text-sm text-slate-600 mt-1">industries supported</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-blue-600">★</p>
              <p className="text-sm text-slate-600 mt-1">
                Trustpilot ratings on every rec
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-blue-600">£0</p>
              <p className="text-sm text-slate-600 mt-1">
                free, no sign-up, no kickbacks
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to stop guessing?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Three minutes. Plain English. Real recommendations.
          </p>
          <Link
            href="/quiz"
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold text-lg px-8 py-4 rounded-full inline-block"
          >
            Start the quiz →
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 RightTech · A portfolio project by Sam Mortimer</p>
          <div className="flex gap-6">
            <Link href="/catalog" className="hover:text-slate-900">
              Catalogue
            </Link>
            <Link href="/how-it-works" className="hover:text-slate-900">
              How it works
            </Link>
            <a
              href="https://www.linkedin.com/in/samuel-mortimer-5a938a14b/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}