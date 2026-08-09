export type RepaymentFrequency = "monthly" | "fortnightly" | "weekly";
export type ExtraRepaymentFrequency = RepaymentFrequency;

export type AmortizationPoint = {
  balance: number;
  interest: number;
  principal: number;
  payment: number;
};

export type ScheduleResult = {
  payment: number;
  totalInterest: number;
  totalAmountRepaid: number;
  payoffDate: string;
  periods: number;
  balanceHistory: number[];
  schedule: AmortizationPoint[];
};

function getPaymentsPerYear(frequency: RepaymentFrequency) {
  return frequency === "monthly" ? 12 : frequency === "fortnightly" ? 26 : 52;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-AU", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function calculateSchedule({
  loanAmount,
  annualRate,
  termYears,
  frequency,
  extraRepayments,
  offsetBalance,
  extraRepaymentFrequency,
}: {
  loanAmount: number;
  annualRate: number;
  termYears: number;
  frequency: RepaymentFrequency;
  extraRepayments: number;
  offsetBalance: number;
  extraRepaymentFrequency: ExtraRepaymentFrequency;
}): ScheduleResult {
  const paymentsPerYear = getPaymentsPerYear(frequency);
  const extraPaymentsPerYear = getPaymentsPerYear(extraRepaymentFrequency);
  const totalPeriods = Math.max(1, Math.round(termYears * paymentsPerYear));
  const periodicRate = annualRate / 100 / paymentsPerYear;

  let balance = loanAmount;
  let totalInterest = 0;
  let totalAmountRepaid = 0;
  let periods = 0;
  const balanceHistory: number[] = [];
  const schedule: AmortizationPoint[] = [];

  const payment = periodicRate > 0
    ? (loanAmount * periodicRate) / (1 - Math.pow(1 + periodicRate, -totalPeriods))
    : loanAmount / totalPeriods;

  const startDate = new Date();

  while (balance > 0.01 && periods < totalPeriods * 2) {
    const effectiveBalance = Math.max(balance - offsetBalance, 0);
    const interest = effectiveBalance * periodicRate;
    const remainingToPay = balance + interest;
    const extraPaymentAmount = extraRepayments * (extraPaymentsPerYear / paymentsPerYear);
    const paymentThisPeriod = Math.min(payment + extraPaymentAmount, remainingToPay);
    const principal = paymentThisPeriod - interest;

    balance = Math.max(balance - principal, 0);
    totalInterest += interest;
    totalAmountRepaid += paymentThisPeriod;
    periods += 1;
    balanceHistory.push(balance);
    schedule.push({ balance, interest, principal, payment: paymentThisPeriod });
  }

  const payoffDate = new Date(startDate);
  if (frequency === "monthly") {
    payoffDate.setMonth(payoffDate.getMonth() + periods);
  } else if (frequency === "fortnightly") {
    payoffDate.setDate(payoffDate.getDate() + periods * 14);
  } else {
    payoffDate.setDate(payoffDate.getDate() + periods * 7);
  }

  return {
    payment,
    totalInterest,
    totalAmountRepaid,
    payoffDate: formatDate(payoffDate),
    periods,
    balanceHistory,
    schedule,
  };
}

export function formatYearsMonths(periodsSaved: number, paymentsPerYear: number) {
  const totalMonthsSaved = Math.max(0, Math.round((periodsSaved / paymentsPerYear) * 12));
  const years = Math.floor(totalMonthsSaved / 12);
  const months = totalMonthsSaved % 12;

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
