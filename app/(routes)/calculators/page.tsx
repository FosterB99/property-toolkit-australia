import { CalculatorPageShell } from "../../components/CalculatorPageShell";

export default function CalculatorsPage() {
  return (
    <CalculatorPageShell
      title="Mortgage Calculator"
      description="Estimate your monthly repayments and understand how loan size, interest rate and term affect your budget."
      formContent={
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">Loan amount</span>
            <input className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400" placeholder="e.g. 600000" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">Interest rate</span>
            <input className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400" placeholder="e.g. 6.2" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">Loan term (years)</span>
            <input className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400" placeholder="e.g. 30" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">Repayment frequency</span>
            <select className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Fortnightly</option>
            </select>
          </label>
        </div>
      }
      resultsSummary="Your estimated loan repayments and interest costs will appear here."
      monthlyRepayment="Monthly repayment"
      weeklyRepayment="Weekly repayment"
      totalInterest="Total interest"
      explanationTitle="How this calculator helps"
      explanationText="This reusable layout gives every calculator a polished experience with a clear form, summary cards and supporting guidance. It is designed to be simple to extend for future calculators."
      relatedCalculators={[
        { title: "Borrowing Power Calculator", href: "/calculators" },
        { title: "Stamp Duty Calculator", href: "/calculators" },
        { title: "Rental Yield Calculator", href: "/calculators" },
      ]}
      shareButtons={
        <>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
            Copy link
          </button>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
            Share
          </button>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
            Save draft
          </button>
        </>
      }
    />
  );
}
