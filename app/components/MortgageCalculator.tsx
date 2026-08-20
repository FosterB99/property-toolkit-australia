"use client";

import { useMemo, useState } from "react";
import { AmortizationChart } from "./AmortizationChart";
import { CalculatorField } from "./CalculatorField";
import { calculateSchedule, formatYearsMonths, type ExtraRepaymentFrequency, type RepaymentFrequency } from "./mortgageCalculatorUtils";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTermAfterSavings(originalTermYears: number, monthsSaved: number) {
  const originalMonths = Math.max(0, originalTermYears * 12);
  const newMonths = Math.max(0, originalMonths - monthsSaved);
  const years = Math.floor(newMonths / 12);
  const months = newMonths % 12;

  if (!years && !months) {
    return "0 months";
  }

  if (years && months) {
    return `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`;
  }

  if (years) {
    return `${years} year${years > 1 ? "s" : ""}`;
  }

  return `${months} month${months > 1 ? "s" : ""}`;
}

type CalculationResult = {
  monthlyRepayment: number;
  fortnightlyRepayment: number;
  weeklyRepayment: number;
  totalInterest: number;
  totalAmountRepaid: number;
  payoffDate: string;
  baselineRepayment: number;
  baselineInterest: number;
  baselinePayoffDate: string;
  interestSavedFromOffset: number;
  timeSavedFromExtraRepayments: string;
  monthsSavedFromExtraRepayments: number;
  chartSeries: Array<{
    label: string;
    balances: number[];
    cumulativeInterests: number[];
    payoffDate: string;
    color: string;
    fill: string;
  }>;
};

const emptyCalculationResult: CalculationResult = {
  monthlyRepayment: 0,
  fortnightlyRepayment: 0,
  weeklyRepayment: 0,
  totalInterest: 0,
  totalAmountRepaid: 0,
  payoffDate: "—",
  baselineRepayment: 0,
  baselineInterest: 0,
  baselinePayoffDate: "—",
  interestSavedFromOffset: 0,
  timeSavedFromExtraRepayments: "0 months",
  monthsSavedFromExtraRepayments: 0,
  chartSeries: [],
};

function buildCalculationResult({
  loanValue,
  rate,
  termYears,
  offset,
  extra,
  repaymentFrequency,
  extraRepaymentFrequency,
}: {
  loanValue: number;
  rate: number;
  termYears: number;
  offset: number;
  extra: number;
  repaymentFrequency: RepaymentFrequency;
  extraRepaymentFrequency: ExtraRepaymentFrequency;
}): CalculationResult {
  if (loanValue <= 0 || termYears <= 0 || rate <= 0) {
    return emptyCalculationResult;
  }

  const selectedSchedule = calculateSchedule({
    loanAmount: loanValue,
    annualRate: rate,
    termYears,
    frequency: repaymentFrequency,
    extraRepayments: extra,
    offsetBalance: offset,
    extraRepaymentFrequency,
  });

  const baselineSchedule = calculateSchedule({
    loanAmount: loanValue,
    annualRate: rate,
    termYears,
    frequency: repaymentFrequency,
    extraRepayments: 0,
    offsetBalance: 0,
    extraRepaymentFrequency,
  });

  const monthlySchedule = calculateSchedule({
    loanAmount: loanValue,
    annualRate: rate,
    termYears,
    frequency: "monthly",
    extraRepayments: extra,
    offsetBalance: 0,
    extraRepaymentFrequency,
  });

  const fortnightlySchedule = calculateSchedule({
    loanAmount: loanValue,
    annualRate: rate,
    termYears,
    frequency: "fortnightly",
    extraRepayments: extra,
    offsetBalance: 0,
    extraRepaymentFrequency,
  });

  const weeklySchedule = calculateSchedule({
    loanAmount: loanValue,
    annualRate: rate,
    termYears,
    frequency: "weekly",
    extraRepayments: extra,
    offsetBalance: 0,
    extraRepaymentFrequency,
  });

  const paymentsPerYear = repaymentFrequency === "monthly" ? 12 : repaymentFrequency === "fortnightly" ? 26 : 52;
  const periodsSaved = Math.max(0, baselineSchedule.periods - selectedSchedule.periods);
  const timeSaved = formatYearsMonths(periodsSaved, paymentsPerYear);
  const monthsSaved = Math.max(0, Math.round((periodsSaved / paymentsPerYear) * 12));

  const chartSeries = [
    {
      label: "Standard loan",
      balances: baselineSchedule.balanceHistory,
      cumulativeInterests: baselineSchedule.schedule.map((point) => point.interest),
      payoffDate: baselineSchedule.payoffDate,
      color: "#38bdf8",
      fill: "url(#without-offset-fill)",
    },
    {
      label: "Offset + extra repayments",
      balances: selectedSchedule.balanceHistory,
      cumulativeInterests: selectedSchedule.schedule.map((point) => point.interest),
      payoffDate: selectedSchedule.payoffDate,
      color: "#10b981",
      fill: "url(#with-offset-fill)",
    },
  ];

  return {
    monthlyRepayment: monthlySchedule.payment,
    fortnightlyRepayment: fortnightlySchedule.payment,
    weeklyRepayment: weeklySchedule.payment,
    totalInterest: selectedSchedule.totalInterest,
    totalAmountRepaid: selectedSchedule.totalAmountRepaid,
    payoffDate: selectedSchedule.payoffDate,
    baselineRepayment: baselineSchedule.payment,
    baselineInterest: baselineSchedule.totalInterest,
    baselinePayoffDate: baselineSchedule.payoffDate,
    interestSavedFromOffset: Math.max(baselineSchedule.totalInterest - selectedSchedule.totalInterest, 0),
    timeSavedFromExtraRepayments: timeSaved,
    monthsSavedFromExtraRepayments: monthsSaved,
    chartSeries,
  };
}

export function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTermYears, setLoanTermYears] = useState("");
  const [repaymentFrequency, setRepaymentFrequency] = useState<RepaymentFrequency>("monthly");
  const [extraRepaymentFrequency, setExtraRepaymentFrequency] = useState<ExtraRepaymentFrequency>("monthly");
  const [offsetBalance, setOffsetBalance] = useState("");
  const [extraRepayments, setExtraRepayments] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [selectedPaymentView, setSelectedPaymentView] = useState<RepaymentFrequency>("monthly");
  const [calculationResult, setCalculationResult] = useState<CalculationResult>(emptyCalculationResult);

  const parsedValues = useMemo(() => {
    const loanValue = Number(loanAmount) || 0;
    const rate = Number(interestRate) || 0;
    const termYears = Number(loanTermYears) || 0;
    const offset = Number(offsetBalance) || 0;
    const extra = Number(extraRepayments) || 0;

    return { loanValue, rate, termYears, offset, extra };
  }, [loanAmount, interestRate, loanTermYears, offsetBalance, extraRepayments]);

  const handleCalculate = () => {
    setCalculationResult(
      buildCalculationResult({
        ...parsedValues,
        repaymentFrequency,
        extraRepaymentFrequency,
      }),
    );
  };

  const handleLoanAmountChange = (value: string) => {
    setLoanAmount(value);
  };

  const repaymentOptions: Array<{ key: RepaymentFrequency; label: string }> = [
    { key: "weekly", label: "Weekly" },
    { key: "fortnightly", label: "Fortnightly" },
    { key: "monthly", label: "Monthly" },
  ];

  const monetaryCards = [
    { label: "Total interest paid", value: formatCurrency(calculationResult.totalInterest), info: "This is the total interest you would pay over the full life of the loan in this scenario." },
    { label: "Total amount repaid", value: formatCurrency(calculationResult.totalAmountRepaid), info: "This is the full amount you would repay, including both principal and interest." },
    { label: "Interest saved", value: formatCurrency(calculationResult.interestSavedFromOffset), info: "This shows how much interest you could save by using offset and extra repayments." },
  ];

  const timeCards = [
    { label: "New loan term", value: formatTermAfterSavings(parsedValues.termYears, calculationResult.monthsSavedFromExtraRepayments), info: "This is your revised loan term after the time saved from extra repayments is applied." },
    { label: "Time saved", value: calculationResult.timeSavedFromExtraRepayments, info: "This shows how much sooner the loan could be repaid with extra repayments." },
    { label: "Original loan term", value: `${parsedValues.termYears} years`, info: "This is the original repayment period you entered before applying any savings." },
    { label: "Estimated payoff date", value: calculationResult.payoffDate, info: "This is the projected date your loan would be fully paid off under these assumptions." },
  ];

  const comparisonCards = [
    { label: "Standard loan", value: formatCurrency(calculationResult.baselineRepayment), info: "This is the repayment amount if you did not use offset or extra repayment features." },
    { label: "Current scenario", value: formatCurrency(calculationResult[`${selectedPaymentView}Repayment` as keyof CalculationResult] as number), info: "This is your chosen repayment amount for the current scenario." },
    { label: "Interest saved", value: formatCurrency(calculationResult.interestSavedFromOffset), info: "This shows the interest advantage from the offset and extra repayment strategy." },
    { label: "Time saved", value: calculationResult.timeSavedFromExtraRepayments, info: "This shows how much faster the loan could be paid off compared with the standard loan." },
  ];

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-6 sm:py-6 lg:w-[min(95vw,1800px)] lg:px-3 lg:py-3 xl:px-4 xl:py-4">
        <div className="rounded-[36px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_30px_120px_-40px_rgba(15,23,42,0.32)] backdrop-blur-xl sm:p-5 lg:p-4 xl:p-5">
          <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700">Property Toolkit Australia</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Mortgage Repayment Calculator
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Model your borrowing costs, compare repayment frequencies and see how offset and extra repayments can accelerate your payoff.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:gap-5 lg:grid-cols-[0.45fr_0.55fr]">
            <div className="rounded-[32px] border border-slate-200/80 bg-slate-50/70 p-3 sm:p-4">
              <div className="grid gap-2.5 md:grid-cols-2">
                <CalculatorField label="Loan Amount" value={loanAmount} onChange={handleLoanAmountChange} type="number" min="0" step="1000" placeholder="560000" helperText="Enter the total loan balance." />
                <CalculatorField label="Interest Rate" value={interestRate} onChange={setInterestRate} type="number" min="0" step="0.01" placeholder="6.2" helperText="Enter the annual interest rate." />
                <CalculatorField label="Loan Term" value={loanTermYears} onChange={setLoanTermYears} type="number" min="1" step="1" placeholder="30" helperText="Enter the loan term in years." />
              </div>

              <div className="mt-3 rounded-[28px] border border-emerald-200 bg-emerald-50/80 p-2.5 shadow-sm">
                <div className="text-left text-sm font-semibold text-emerald-900">
                  <span>Advanced Options</span>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <CalculatorField label="Offset Balance" value={offsetBalance} onChange={setOffsetBalance} type="number" min="0" step="1000" placeholder="0" helperText="Optional offset account balance that reduces interest charged." />
                  <CalculatorField label="Extra Repayments" value={extraRepayments} onChange={setExtraRepayments} type="number" min="0" step="100" placeholder="0" helperText="Optional extra repayments per repayment period." />
                </div>
                <div className="mt-2.5 rounded-[20px] border border-emerald-200 bg-white/70 p-2.5">
                  <p className="text-sm font-semibold text-emerald-900">Extra Repayment Frequency</p>
                  <div className="mt-2 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                    {repaymentOptions.map((option) => {
                      const isActive = extraRepaymentFrequency === option.key;
                      return (
                        <button
                          key={option.key}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setExtraRepaymentFrequency(option.key)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-[24px] border border-emerald-200 bg-emerald-50/80 p-2.5 text-sm text-emerald-800">
                <p className="font-semibold">Assumptions</p>
                <p className="mt-1 leading-6">Repayments use principal-and-interest amortisation. Offset balances reduce the interest-bearing balance without reducing the loan principal.</p>
              </div>

              <button type="button" onClick={handleCalculate} className="mt-3 inline-flex items-center rounded-full bg-gradient-to-r from-emerald-600 to-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-90">
                Calculate
              </button>
            </div>

            <div className="rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-3 text-white shadow-[0_35px_100px_-35px_rgba(6,78,59,0.75)] sm:p-4">
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-3 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-200">Your repayment</p>
                <div aria-live="polite" role="status" className="mt-3 text-3xl font-semibold transition-all duration-300 sm:text-4xl">{formatCurrency(calculationResult[`${selectedPaymentView}Repayment` as keyof CalculationResult] as number)}</div>
                <p className="mt-1 text-sm leading-6 text-slate-300">per {selectedPaymentView}</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {repaymentOptions.map((option) => {
                    const isActive = selectedPaymentView === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setSelectedPaymentView(option.key)}
                        className={`rounded-full border px-2.5 py-1.5 text-sm font-semibold transition ${isActive ? "border-emerald-400 bg-emerald-500/20 text-emerald-200" : "border-white/20 bg-white/10 text-slate-200 hover:bg-white/20"}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">Monetary results</p>
                  <div className="mt-2.5 grid gap-2.5 md:grid-cols-2">
                    {monetaryCards.map((card) => (
                      <div key={card.label} className="rounded-[18px] border border-white/10 bg-white/10 p-2.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-slate-300">{card.label}</p>
                          <span className="group relative inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-400/60 text-[10px] font-semibold text-slate-300" aria-label={`${card.label}: ${card.info}`}>
                            i
                            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-56 -translate-x-1/2 rounded-xl border border-slate-200 bg-slate-950/95 px-3 py-2 text-[11px] leading-5 text-slate-100 shadow-lg group-hover:block group-focus-within:block">
                              {card.info}
                            </span>
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-semibold">{card.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">Time results</p>
                  <div className="mt-2.5 grid gap-2.5 md:grid-cols-2">
                    {timeCards.map((card) => (
                      <div key={card.label} className="rounded-[18px] border border-white/10 bg-white/10 p-2.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-slate-300">{card.label}</p>
                          <span className="group relative inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-400/60 text-[10px] font-semibold text-slate-300" aria-label={`${card.label}: ${card.info}`}>
                            i
                            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-56 -translate-x-1/2 rounded-xl border border-slate-200 bg-slate-950/95 px-3 py-2 text-[11px] leading-5 text-slate-100 shadow-lg group-hover:block group-focus-within:block">
                              {card.info}
                            </span>
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-semibold">{card.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4 rounded-[32px] border border-slate-200/80 bg-white/85 p-3 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] sm:p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-700">Loan balance over time</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Amortisation comparison</h3>
              </div>
              <p className="text-sm text-slate-500">The green line shows the reduced balance with your offset and extra repayments.</p>
            </div>
            <div className="mt-3 rounded-[24px] border border-slate-200 bg-slate-50/70 p-2.5">
              {calculationResult.chartSeries.length > 0 ? (
                <AmortizationChart series={calculationResult.chartSeries} loanAmount={parsedValues.loanValue} frequency={repaymentFrequency} termYears={parsedValues.termYears} />
              ) : (
                <div className="flex h-64 items-center justify-center text-sm text-slate-500">Run a calculation to generate the balance history.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
