import { CalculatorCard } from "./components/CalculatorCard";
import { FeatureCard } from "./components/FeatureCard";

const featureCards = [
  {
    eyebrow: "Buying",
    title: "Secure your next move",
    description:
      "Compare suburbs, estimate deposits and plan a confident purchase strategy with fast, clear insights.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1v-9.5Z" />
      </svg>
    ),
  },
  {
    eyebrow: "Investing",
    title: "Grow wealth with confidence",
    description:
      "Model yields, costs and performance scenarios before you commit to an investment move.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h16M7 14l3-3 3 2 4-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 8h4v4" />
      </svg>
    ),
  },
  {
    eyebrow: "Grants",
    title: "Unlock support faster",
    description:
      "Find grants, compare eligibility and stay across key deadlines without the guesswork.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m7 7 10 10M17 7 7 17" />
      </svg>
    ),
  },
  {
    eyebrow: "Renovating",
    title: "Budget with precision",
    description:
      "Plan upgrades, estimate spend and understand your return before you start building.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M6 4h12v16H6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
      </svg>
    ),
  },
];

const calculators = [
  {
    title: "Mortgage Calculator",
    value: "Estimate repayments",
    details: "Model principal, term and rate changes in seconds.",
  },
  {
    title: "Borrowing Power Calculator",
    value: "See what you can afford",
    details: "Compare income, expenses and deposit assumptions quickly.",
  },
  {
    title: "Stamp Duty Calculator",
    value: "Know transfer costs",
    details: "Understand the fees attached to your next purchase.",
  },
  {
    title: "Rental Yield Calculator",
    value: "Check potential returns",
    details: "Measure income performance against value and expenses.",
  },
  {
    title: "Offset Savings Calculator",
    value: "Model extra savings",
    details: "See how offset balances can reduce interest over time.",
  },
  {
    title: "Renovation ROI Calculator",
    value: "Estimate uplift",
    details: "Compare upgrade spend against likely value and rent gains.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 rounded-[36px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_30px_110px_-40px_rgba(15,23,42,0.32)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr] lg:p-10 xl:p-12">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              Premium property intelligence for Australia
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Everything You Need to Buy, Build and Invest in Australian Property.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Free property calculators, grant information, investment tools and renovation estimators.
            </p>

            <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-3 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.35)]">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-1 items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
                  </svg>
                  <input
                    aria-label="Search calculators"
                    className="w-full border-none bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
                    placeholder="Search calculators..."
                  />
                </div>
                <button className="rounded-[22px] bg-gradient-to-r from-emerald-600 to-sky-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-90">
                  Explore tools
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-2">Fast calculators</span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-2">Grant guidance</span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-2">Investor-ready insights</span>
            </div>
          </div>

          <div className="rounded-[32px] border border-emerald-100/80 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 text-white shadow-[0_35px_100px_-35px_rgba(6,78,59,0.75)] sm:p-8">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Property readiness score</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Live insights</span>
            </div>
            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.32em] text-emerald-200">Smart snapshot</p>
              <div className="mt-4 text-5xl font-semibold">94%</div>
              <p className="mt-3 max-w-sm text-base leading-7 text-slate-300">
                Your strategy is in a strong position for the next opportunity.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Monthly savings</p>
                <p className="mt-2 text-2xl font-semibold">$1,840</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Target window</p>
                <p className="mt-2 text-2xl font-semibold">6–9 months</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Key capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            A complete toolkit for buying, building and investing.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature) => (
            <FeatureCard key={feature.eyebrow} {...feature} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.35)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Featured calculators</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Trusted calculations for every proposition.
              </h2>
            </div>
            <a href="/calculators" className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
              View all tools
            </a>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {calculators.map((calculator) => (
              <CalculatorCard key={calculator.title} {...calculator} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
