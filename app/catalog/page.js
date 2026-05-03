"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { catalog } from "../catalog";

const PRICE_TIERS = ["Free", "Low", "Mid", "High"];

const PRICE_LABELS = {
  Free: "Free",
  Low: "£",
  Mid: "££",
  High: "£££",
};

const PRICE_DESCRIPTIONS = {
  Free: "Free or freemium",
  Low: "Up to ~£20/mo",
  Mid: "~£20–60/mo",
  High: "£60+/mo",
};

const INDUSTRIES = [
  { tag: "retail", emoji: "🛍️", label: "Retail" },
  { tag: "hospitality", emoji: "🍽️", label: "Hospitality" },
  { tag: "trades", emoji: "🔧", label: "Trades" },
  { tag: "professional-services", emoji: "💼", label: "Professional services" },
  { tag: "health", emoji: "💆", label: "Health & wellness" },
  { tag: "creative", emoji: "🎨", label: "Creative" },
];

const PAIN_LABELS = {
  "finances-vat": "Finances & VAT",
  admin: "Admin",
  "cash-flow": "Cash flow",
  "getting-paid": "Getting paid",
  payroll: "Payroll",
  "keeping-staff": "Keeping staff",
  "finding-staff": "Finding staff",
  "team-comms": "Team comms",
  "customer-comms": "Customer comms",
  "new-customers": "New customers",
  "retain-customers": "Retain customers",
  website: "Website",
  stock: "Stock",
  bookings: "Bookings",
  "staff-rotas": "Staff rotas",
  security: "Security",
};

function monogram(name) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function tierBadge(tier) {
  if (tier === "Free") return "bg-emerald-100 text-emerald-800";
  if (tier === "Low") return "bg-blue-100 text-blue-800";
  if (tier === "Mid") return "bg-amber-100 text-amber-800";
  return "bg-rose-100 text-rose-800";
}

export default function CatalogPage() {
  const categories = useMemo(() => {
    const set = new Set();
    catalog.forEach((t) => set.add(t.category));
    return Array.from(set).sort();
  }, []);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTiers, setActiveTiers] = useState([]);
  const [activeIndustries, setActiveIndustries] = useState([]);
  const [ukOnly, setUkOnly] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const toggle = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.filter((t) => {
      if (activeCategory !== "All" && t.category !== activeCategory) return false;
      if (activeTiers.length && !activeTiers.includes(t.priceTier)) return false;
      if (
        activeIndustries.length &&
        !activeIndustries.some((tag) => t.industryTags.includes(tag))
      )
        return false;
      if (ukOnly && !t.ukSpecific) return false;
      if (q) {
        const hay = `${t.name} ${t.description} ${t.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [search, activeCategory, activeTiers, activeIndustries, ukOnly]);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setActiveTiers([]);
    setActiveIndustries([]);
    setUkOnly(false);
  };

  const hasFilters =
    search ||
    activeCategory !== "All" ||
    activeTiers.length ||
    activeIndustries.length ||
    ukOnly;

  return (
    <div className="bg-white min-h-screen">
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
            <Link href="/catalog" className="text-slate-900 font-semibold">
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

      <header className="px-6 py-12 sm:py-16 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-3">
            The full catalogue
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            Browse every tool we recommend.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            {catalog.length} tools, hand-picked for UK SMEs across {INDUSTRIES.length}{" "}
            industries. Filter by category, price, or industry — or take the{" "}
            <Link href="/quiz" className="text-blue-600 font-semibold hover:underline">
              3-minute quiz
            </Link>{" "}
            to get a personal shortlist.
          </p>
        </div>
      </header>

      <section className="px-6 py-8 border-b border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools by name or description…"
            className="w-full bg-white border border-slate-200 rounded-full px-5 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-2">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("All")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  activeCategory === "All"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                    activeCategory === cat
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-2">
                Price
              </p>
              <div className="flex flex-wrap gap-2">
                {PRICE_TIERS.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => toggle(activeTiers, setActiveTiers, tier)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                      activeTiers.includes(tier)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                    }`}
                    title={PRICE_DESCRIPTIONS[tier]}
                  >
                    {PRICE_LABELS[tier]} {tier !== "Free" && tier}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-2">
                Industry
              </p>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.tag}
                    onClick={() => toggle(activeIndustries, setActiveIndustries, ind.tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                      activeIndustries.includes(ind.tag)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {ind.emoji} {ind.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ukOnly}
                onChange={(e) => setUkOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 font-medium">
                🇬🇧 UK-specific tools only
              </span>
            </label>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-600">
                Showing <strong className="text-slate-900">{filtered.length}</strong> of{" "}
                {catalog.length}
              </span>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-slate-600 mb-3">
                No tools match those filters.
              </p>
              <button
                onClick={clearFilters}
                className="text-blue-600 font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((tool) => {
                const isOpen = expanded === tool.name;
                return (
                  <div
                    key={tool.name}
                    className={`bg-white border rounded-2xl transition ${
                      isOpen
                        ? "border-blue-400 shadow-lg sm:col-span-2"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <button
                      onClick={() => setExpanded(isOpen ? null : tool.name)}
                      className="w-full text-left p-5 flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                        {monogram(tool.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className="font-bold text-slate-900 truncate">
                            {tool.name}
                          </h3>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${tierBadge(
                              tool.priceTier
                            )}`}
                          >
                            {PRICE_LABELS[tool.priceTier]}
                            {tool.priceTier !== "Free" && ` ${tool.priceTier}`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{tool.category}</p>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {tool.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          {tool.ukSpecific && (
                            <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full">
                              🇬🇧 UK-specific
                            </span>
                          )}
                          <span className="text-xs text-blue-600 font-semibold ml-auto">
                            {isOpen ? "Hide details ↑" : "Show details ↓"}
                          </span>
                        </div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-100 px-5 py-5 bg-slate-50 rounded-b-2xl">
                        <p className="text-slate-700 leading-relaxed mb-5">
                          {tool.description}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-5 mb-5">
                          <div>
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-2">
                              Best for
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {tool.industryTags.length === 0 ? (
                                <span className="text-sm text-slate-600">
                                  Any industry
                                </span>
                              ) : (
                                tool.industryTags.map((tag) => {
                                  const ind = INDUSTRIES.find((i) => i.tag === tag);
                                  return (
                                    <span
                                      key={tag}
                                      className="text-xs bg-white border border-slate-200 text-slate-700 font-medium px-2 py-1 rounded-full"
                                    >
                                      {ind ? `${ind.emoji} ${ind.label}` : tag}
                                    </span>
                                  );
                                })
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-2">
                              Helps with
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {tool.painTags.length === 0 ? (
                                <span className="text-sm text-slate-600">
                                  General use
                                </span>
                              ) : (
                                tool.painTags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs bg-white border border-slate-200 text-slate-700 font-medium px-2 py-1 rounded-full"
                                  >
                                    {PAIN_LABELS[tag] || tag}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-center">
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-0.5">Price</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {PRICE_DESCRIPTIONS[tool.priceTier]}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-0.5">Team size</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {tool.minSize}
                              {tool.maxSize >= 999 ? "+" : `–${tool.maxSize}`} people
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-0.5">Tech comfort</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {tool.techComfort === 1
                                ? "Easy"
                                : tool.techComfort === 2
                                ? "Medium"
                                : "Advanced"}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-0.5">UK-specific</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {tool.ukSpecific ? "Yes 🇬🇧" : "No"}
                            </p>
                          </div>
                        </div>

                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-full text-sm"
                        >
                          Visit {tool.name} →
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-900 px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Not sure which to pick?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Take the 3-minute quiz and we&apos;ll narrow {catalog.length} tools down to
            the handful that fit your business.
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