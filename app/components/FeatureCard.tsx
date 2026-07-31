import type { ReactNode } from "react";

type FeatureCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
};

export function FeatureCard({
  eyebrow,
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <div className="group rounded-[28px] border border-emerald-100/80 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(15,118,110,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-25px_rgba(15,118,110,0.35)]">
      <div className="mb-5 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}
