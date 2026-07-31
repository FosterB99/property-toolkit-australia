import type { ReactNode } from "react";

type CalculatorPageShellProps = {
  title: string;
  description: string;
  formContent: ReactNode;
  resultsSummary?: string;
  monthlyRepayment?: string;
  weeklyRepayment?: string;
  totalInterest?: string;
  explanationTitle?: string;
  explanationText?: string;
  faqs?: Array<{ question: string; answer: string }>;
  relatedCalculators?: Array<{ title: string; href: string }>;
  shareButtons?: ReactNode;
};

export function CalculatorPageShell({
  title,
  description,
  formContent,
  resultsSummary = "Your results will appear here once the calculator is used.",
  monthlyRepayment = "Monthly repayment",
  weeklyRepayment = "Weekly repayment",
  totalInterest = "Total interest",
  explanationTitle = "How this calculator works",
  explanationText = "This section can be tailored for each calculator to explain assumptions, formulas and how to interpret the results.",
  faqs = [
    {
      question: "Is this calculator suitable for Australian property planning?",
      answer: "Yes. The layout is designed to support Australian property calculations and can be tailored to local rules and assumptions.",
    },
    {
      question: "Will I need to enter complex details?",
      answer: "No. The form is designed to stay simple and clear while collecting the key values needed for a useful estimate.",
    },
  ],
  relatedCalculators = [
    { title: "Mortgage Calculator", href: "/calculators" },
    { title: "Borrowing Power Calculator", href: "/calculators" },
  ],
  shareButtons,
}: CalculatorPageShellProps) {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.35)] sm:p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Calculator</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>

            <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5 sm:p-6">
              {formContent}
              <button className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-emerald-600 to-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-90">
                Calculate
              </button>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 text-white shadow-[0_35px_100px_-35px_rgba(6,78,59,0.75)] sm:p-8 lg:p-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-200">Results</p>
                <h2 className="mt-2 text-2xl font-semibold">Summary</h2>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-slate-300">{resultsSummary}</p>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
                <p className="text-sm text-slate-300">Monthly repayment</p>
                <p className="mt-2 text-2xl font-semibold">{monthlyRepayment}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
                <p className="text-sm text-slate-300">Weekly repayment</p>
                <p className="mt-2 text-2xl font-semibold">{weeklyRepayment}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
                <p className="text-sm text-slate-300">Total interest</p>
                <p className="mt-2 text-2xl font-semibold">{totalInterest}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <section className="rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] sm:p-8">
              <h3 className="text-2xl font-semibold text-slate-950">{explanationTitle}</h3>
              <p className="mt-4 text-lg leading-8 text-slate-600">{explanationText}</p>
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] sm:p-8">
              <h3 className="text-2xl font-semibold text-slate-950">FAQs</h3>
              <div className="mt-6 space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4">
                    <p className="font-semibold text-slate-900">{faq.question}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] sm:p-8">
              <h3 className="text-2xl font-semibold text-slate-950">Related calculators</h3>
              <div className="mt-6 space-y-3">
                {relatedCalculators.map((item) => (
                  <a key={item.title} href={item.href} className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
                    <span>{item.title}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] sm:p-8">
              <h3 className="text-2xl font-semibold text-slate-950">Share</h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {shareButtons ?? (
                  <>
                    <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
                      Copy link
                    </button>
                    <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
                      Share
                    </button>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
