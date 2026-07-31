type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageShell({ eyebrow, title, description }: PageShellProps) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.35)] sm:p-10 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700">{eyebrow}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Navigation architecture ready
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Responsive mobile menu active
          </span>
        </div>
      </div>
    </main>
  );
}
