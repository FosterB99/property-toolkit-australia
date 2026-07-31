type CalculatorCardProps = {
  title: string;
  value: string;
  details: string;
};

export function CalculatorCard({ title, value, details }: CalculatorCardProps) {
  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-6 shadow-[0_16px_50px_-24px_rgba(15,23,42,0.35)]">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
        {title}
      </p>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{details}</p>
    </div>
  );
}
