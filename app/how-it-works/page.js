import Link from "next/link";

export const metadata = {
  title: "How it works · RightTech",
  description:
    "How RightTech matches UK SMEs to the right software — plain English, no affiliate kickbacks, free options surfaced first.",
};

export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      <nav className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#2563eb"/>
                <path d="M9 16.5L14 21.5L23 11.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold text-xl text-slate-900">
            Right<span className="text-blue-600">Tech</span>
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/catalog" className="text-slate-600 hover:text-slate-900">
              Catalogue
            </Link>
            <Link href="/how-it-works" className="text-slate-900 font-semibold">
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

      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-4">
            How it works
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-[1.05] mb-6">
            No magic. Just plain English &amp; honest matching.
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            RightTech isn&apos;t an affiliate site. It&apos;s a curated catalogue, a
            10-question quiz, and an AI adviser — designed for UK SME owner-managers
            who want to spend less time choosing software and more time running their
            business.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-2">
                Step 1
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Ten plain-English questions
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                No tech jargon. No 50-field forms. Just the things that matter:
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>· What kind of business is it?</li>
                <li>· How big is your team?</li>
                <li>· Where does your time disappear?</li>
                <li>· What do you already use?</li>
                <li>· What budget feels comfortable?</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-xs font-semibold tracking-widest text-purple-600 uppercase mb-2">
                Step 2
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                A curated UK-first catalogue
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Every tool in the catalogue is hand-picked and tagged for:
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>· UK availability and HMRC/MTD readiness</li>
                <li>· Industry it suits (Retail, Trades, Hospitality, etc.)</li>
                <li>· Business size (1, 2-10, 10+)</li>
                <li>· Real price tier and total monthly cost</li>
                <li>· Trustpilot rating, refreshed quarterly</li>
              </ul>
              <p className="text-sm text-slate-500 mt-4 italic">
                No US-only tools. No affiliate kickbacks.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-2">
                Step 3
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                An AI adviser, in plain English
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Once you&apos;ve got a shortlist, an AI adviser reads your answers and
                writes a personal walk-through plus a 90-day plan.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>· UK spelling, no jargon</li>
                <li>· Outcome-focused, not feature lists</li>
                <li>
                  · Tells you what to do <em>this week</em>
                </li>
                <li>· With a total monthly cost up front</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-3">
            Behind the scenes
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-8">
            How the matching actually works.
          </h2>

          <div className="space-y-8">
            {[
              {
                n: 1,
                title: "We score every tool against your answers",
                body: "Each tool has tags for industry, size, pain points, comfort and budget. Your answers become a query — and we score every tool from the catalogue, weighted by how strongly each factor mattered.",
              },
              {
                n: 2,
                title: "We surface free options first",
                body: "If two tools tie on fit, the free or cheaper option wins. We never bury free tools beneath paid ones — small businesses don't need that.",
              },
              {
                n: 3,
                title: "The AI sequences your rollout",
                body: "Once you've got a shortlist, the AI orders them into a 90-day plan — what to do this week, this month, this quarter — with the total monthly cost shown up front so there are no surprises.",
              },
              {
                n: 4,
                title: "No data leaves your browser unprompted",
                body: "Your answers stay in your browser session. We send only your shortlist + answers to the AI to generate the prose — and we never ask for your email, name, or business details.",
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center flex-shrink-0">
                  {step.n}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="impact-methodology" className="bg-slate-50 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-3">
            Where the impact numbers come from
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            &ldquo;Saves ~3 hrs/week&rdquo; — based on what?
          </h2>

          <p className="text-slate-700 leading-relaxed mb-6">
            Every tool card shows an expected impact (e.g. &ldquo;saves ~3
            hrs/week&rdquo;, &ldquo;+15% repeat visits&rdquo;). These are{" "}
            <strong>estimates</strong>, not guarantees. Here&apos;s where they come
            from:
          </p>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-1">
                1. Vendor-published case studies
              </p>
              <p className="text-sm text-slate-600">
                Most major tools (FreeAgent, Xero, Square, Mailchimp etc.) publish
                customer case studies with quantified outcomes. We take the median
                across UK-based small-business cases.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-1">
                2. Customer surveys
              </p>
              <p className="text-sm text-slate-600">
                Where vendors publish aggregated user-survey data (e.g. &ldquo;users
                save an average of X hours/week&rdquo;), we cite that number directly
                and link to the source.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-1">
                3. Independent UK SME benchmarks
              </p>
              <p className="text-sm text-slate-600">
                For broader claims (e.g. &ldquo;MTD compliance&rdquo;), we reference
                HMRC guidance and FSB research — sources every UK small business can
                verify.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-1">
                ⚠️ The honest caveat
              </p>
              <p className="text-sm text-slate-700">
                These are <strong>medians</strong>, not promises. A two-person
                plumbing firm saving &ldquo;3 hours a week&rdquo; on invoicing might
                save 5 — or 1. Always start with a free trial.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-3">
            Ratings policy
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Why we show low ratings too.
          </h2>
          <div className="text-slate-700 leading-relaxed space-y-4">
            <p>
              Some recommended tools score very high on Trustpilot. Others — including
              industry-standard tools like Mailchimp — score surprisingly low, often
              because Trustpilot disproportionately attracts complaints rather than
              satisfied users.
            </p>
            <p>
              <strong>We show every score honestly, even when it&apos;s bad.</strong>{" "}
              If a tool is a strong fit for your needs but has a polarised review
              profile, we flag that — and you decide.
            </p>
            <p>
              Ratings are refreshed quarterly. The current snapshot is from{" "}
              <strong>May 2026</strong>, sourced from Trustpilot&apos;s public business
              pages.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-3">
            Honest disclaimers
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Things you should know.
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "This is a portfolio project.",
                body: "Built by Sam Mortimer as a working demonstration of what a useful, honest SME-tech site could look like. It is not a registered business or a regulated adviser.",
              },
              {
                title: "No affiliate links, no kickbacks.",
                body: "Every recommendation is based on fit, not commission. If a free tool is the right answer, that's the answer.",
              },
              {
                title: "The AI is a guide, not a guarantee.",
                body: "It surfaces sensible starting points based on your answers — but every business is different. Always do your own due diligence before committing to a tool.",
              },
              {
                title: "The catalogue is curated, not exhaustive.",
                body: "We only include tools we'd recommend to a friend. If you can't find what you need, the right answer might not be in here yet.",
              },
            ].map((d) => (
              <div
                key={d.title}
                className="bg-white rounded-xl border border-slate-200 p-5"
              >
                <p className="font-semibold text-slate-900 mb-1">{d.title}</p>
                <p className="text-slate-600 text-sm">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-3">
            Why I built this
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            A note from the maker.
          </h2>
          <div className="text-slate-700 leading-relaxed space-y-4">
            <p>
              I&apos;m Sam — I work in customer success at Microsoft, helping
              enterprise customers get value out of complex tech. The further
              I&apos;ve gone in that world, the more I&apos;ve noticed how much harder
              it is at the other end: the small UK business owner trying to work out
              which accounting tool to use, with 30 review sites all telling them
              something different.
            </p>
            <p>
              RightTech is the site I wished existed for my friends running cafés,
              plumbing firms and online shops. Plain English. UK-first. Free options
              surfaced. No affiliate noise.
            </p>
            <p>
              It&apos;s also a working portfolio piece — a chance to put a Next.js
              front-end, an Azure-hosted AI adviser, and real product judgement
              together in one place.
            </p>
            <p className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm">
              <strong>One promise:</strong> if RightTech ever goes away, the
              recommendations don&apos;t. The catalogue is open, the methodology is
              documented, and you can save your shortlist as a PDF any time.
            </p>
            <p>
              If you&apos;re a recruiter, hiring manager or fellow tinkerer —
              I&apos;d love to chat.
            </p>
          </div>
          <div className="mt-8 flex gap-3">
            <a
              href="https://www.linkedin.com/in/samuel-mortimer-5a938a14b/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-full"
            >
              Connect on LinkedIn
            </a>
            <Link
              href="/quiz"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full"
            >
              Try the quiz →
            </Link>
          </div>
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