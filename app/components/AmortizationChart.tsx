"use client";

import { useEffect, useMemo, useState } from "react";

type RepaymentFrequency = "monthly" | "fortnightly" | "weekly";

type ChartSeries = {
  label: string;
  balances: number[];
  cumulativeInterests: number[];
  payoffDate: string;
  color: string;
  fill: string;
};

type AmortizationChartProps = {
  series: ChartSeries[];
  loanAmount: number;
  frequency: RepaymentFrequency;
};

type ChartPoint = {
  index: number;
  x: number;
  y: number;
  year: number;
  balance: number;
  interest: number;
  principal: number;
};

type SeriesPoint = {
  label: string;
  balances: number[];
  cumulativeInterests: number[];
  payoffDate: string;
  color: string;
  fill: string;
  points: ChartPoint[];
  linePath: string;
  areaPath: string;
  payoffPoint: ChartPoint;
};

function buildSmoothPath(points: ChartPoint[]) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  const pathParts = [`M ${points[0].x} ${points[0].y}`];

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(0, index - 1)];
    const current = points[index];
    const next = points[index + 1];
    const following = points[Math.min(points.length - 1, index + 2)];

    const controlPointOneX = current.x + (next.x - previous.x) / 6;
    const controlPointOneY = current.y + (next.y - previous.y) / 6;
    const controlPointTwoX = next.x - (following.x - current.x) / 6;
    const controlPointTwoY = next.y - (following.y - current.y) / 6;

    pathParts.push(`C ${controlPointOneX.toFixed(2)} ${controlPointOneY.toFixed(2)} ${controlPointTwoX.toFixed(2)} ${controlPointTwoY.toFixed(2)} ${next.x.toFixed(2)} ${next.y.toFixed(2)}`);
  }

  return pathParts.join(" ");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatYears(value: number) {
  return `${value.toFixed(1)} yrs`;
}

export function AmortizationChart({ series, loanAmount, frequency }: AmortizationChartProps) {
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = window.setTimeout(() => setIsAnimating(false), 900);
    return () => window.clearTimeout(timer);
  }, [series, loanAmount, frequency]);

  const chartData = useMemo(() => {
    const baseLength = Math.max(2, series[0]?.balances.length ?? 2);
    const pointsCount = Math.max(8, Math.min(18, baseLength));
    const step = Math.max(1, Math.floor((baseLength - 1) / Math.max(1, pointsCount - 1)));
    const sampledIndexes = Array.from({ length: pointsCount }, (_, index) => {
      if (index === pointsCount - 1) {
        return baseLength - 1;
      }
      return Math.min(baseLength - 1, index * step);
    });

    const paymentsPerYear = frequency === "monthly" ? 12 : frequency === "fortnightly" ? 26 : 52;
    const maxBalance = Math.max(loanAmount, ...series.flatMap((item) => item.balances));
    const maxYear = Math.max(5, Math.ceil(baseLength / paymentsPerYear) + 1);
    const width = 980;
    const height = 480;
    const padding = { top: 28, right: 34, bottom: 76, left: 112 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const points = sampledIndexes.map((index) => {
      const year = index / paymentsPerYear;
      return {
        index,
        x: padding.left + (year / maxYear) * innerWidth,
        year,
      };
    });

    const xTicks = Array.from({ length: Math.floor(maxYear / 5) + 1 }, (_, tick) => tick * 5).filter((tick) => tick <= maxYear);
    const yTicks = Array.from({ length: 5 }, (_, tick) => {
      const ratio = tick / 4;
      return maxBalance * (1 - ratio);
    });

    return {
      width,
      height,
      padding,
      innerWidth,
      innerHeight,
      maxBalance,
      maxYear,
      points,
      xTicks,
      yTicks,
    };
  }, [series, loanAmount, frequency]);

  const seriesData = useMemo(() => {
    return series.map((item) => {
      const points = chartData.points.map((point) => {
        const balance = item.balances[point.index] ?? 0;
        const interest = item.cumulativeInterests[point.index] ?? 0;
        const principal = Math.max(0, loanAmount - balance);
        const y = chartData.padding.top + (1 - (balance / Math.max(1, chartData.maxBalance))) * chartData.innerHeight;
        return {
          ...point,
          balance,
          interest,
          principal,
          y,
        } satisfies ChartPoint;
      });

      const linePath = buildSmoothPath(points);
      const baselineY = chartData.height - chartData.padding.bottom;
      const areaPath = `${linePath} L ${chartData.width - chartData.padding.right} ${baselineY} L ${chartData.padding.left} ${baselineY} Z`;

      const payoffIndex = item.balances.findIndex((balance) => balance <= 0.01);
      const payoffPoint = payoffIndex >= 0 ? points.find((point) => point.index === payoffIndex) ?? points[points.length - 1] : points[points.length - 1];

      return {
        ...item,
        points,
        linePath,
        areaPath,
        payoffPoint,
      } satisfies SeriesPoint & { linePath: string; areaPath: string; payoffPoint: ChartPoint };
    });
  }, [chartData, loanAmount, series]);

  const activePoint = useMemo(() => {
    if (activePointIndex === null) {
      return null;
    }

    return seriesData[0]?.points.find((point) => point.index === activePointIndex) ?? null;
  }, [activePointIndex, seriesData]);

  const activeSeriesRows = useMemo(() => {
    if (activePointIndex === null) {
      return [];
    }

    return seriesData.map((item) => {
      const point = item.points.find((candidate) => candidate.index === activePointIndex);
      if (!point) {
        return null;
      }

      return {
        label: item.label,
        color: item.color,
        balance: point.balance,
        principal: point.principal,
        interest: point.interest,
        year: point.year,
        payoffDate: item.payoffDate,
      };
    }).filter((row): row is {
      label: string;
      color: string;
      balance: number;
      principal: number;
      interest: number;
      year: number;
      payoffDate: string;
    } => row !== null);
  }, [activePointIndex, seriesData]);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(248,250,252,0.95))] p-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 px-4 py-3 sm:px-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500">Amortisation comparison</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">Banking-style balance trajectory</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.45)]">
          <div className="flex items-center gap-2 rounded-full bg-slate-50 px-2.5 py-1 text-sm text-slate-700"><span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Standard loan</div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-sm text-emerald-700"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Offset + extra repayments</div>
        </div>
      </div>

      <div className="px-2 pb-2 sm:px-3 sm:pb-3">
        <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <div className="min-w-0">
            <svg
              viewBox={`0 0 ${chartData.width} ${chartData.height}`}
              className="h-[460px] w-full"
              onMouseLeave={() => setActivePointIndex(null)}
            >
              <defs>
                <linearGradient id="with-offset-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.36" />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity="0.16" />
                </linearGradient>
                <linearGradient id="without-offset-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.14" />
                </linearGradient>
                <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.12" />
                </filter>
              </defs>

              {chartData.yTicks.map((tickValue, tickIndex) => {
                const y = chartData.padding.top + (tickIndex / 4) * chartData.innerHeight;
                return (
                  <g key={`y-${tickValue}`}>
                    <line x1={chartData.padding.left} y1={y} x2={chartData.width - chartData.padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
                    <text x={chartData.padding.left - 24} y={y + 4} textAnchor="end" className="fill-slate-500 text-[12px]">{formatCurrency(tickValue)}</text>
                  </g>
                );
              })}

              {chartData.xTicks.map((tickValue) => {
                const x = chartData.padding.left + (tickValue / chartData.maxYear) * chartData.innerWidth;
                return (
                  <g key={`x-${tickValue}`}>
                    <line x1={x} y1={chartData.padding.top} x2={x} y2={chartData.height - chartData.padding.bottom} stroke="#e2e8f0" strokeDasharray="4 4" />
                    <text x={x} y={chartData.height - 34} textAnchor="middle" className="fill-slate-500 text-[12px]">{tickValue}</text>
                  </g>
                );
              })}

              <line x1={chartData.padding.left} y1={chartData.height - chartData.padding.bottom} x2={chartData.width - chartData.padding.right} y2={chartData.height - chartData.padding.bottom} stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1={chartData.padding.left} y1={chartData.padding.top} x2={chartData.padding.left} y2={chartData.height - chartData.padding.bottom} stroke="#cbd5e1" strokeWidth="1.5" />

              <text x={chartData.width / 2} y={chartData.height - 12} textAnchor="middle" className="fill-slate-600 text-[13px] font-semibold">Loan age (Years)</text>
              <text x={chartData.padding.left - 96} y={chartData.height / 2} textAnchor="middle" transform={`rotate(-90 ${chartData.padding.left - 96} ${chartData.height / 2})`} className="fill-slate-600 text-[13px] font-semibold">Remaining Loan Balance ($)</text>

              {seriesData.map((item, seriesIndex) => (
                <g key={item.label}>
                  <path d={item.areaPath} fill={seriesIndex === 0 ? "url(#without-offset-fill)" : "url(#with-offset-fill)"} />
                  <path
                    d={item.linePath}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#soft-glow)"
                    style={isAnimating ? { animation: "dash 1000ms cubic-bezier(0.22, 1, 0.36, 1) forwards" } : undefined}
                  />
                  {activePointIndex !== null ? (
                    <line
                      x1={item.points.find((point) => point.index === activePointIndex)?.x ?? item.points[0]?.x ?? 0}
                      y1={chartData.padding.top}
                      x2={item.points.find((point) => point.index === activePointIndex)?.x ?? item.points[0]?.x ?? 0}
                      y2={chartData.height - chartData.padding.bottom}
                      stroke={item.color}
                      strokeDasharray="6 6"
                      strokeOpacity="0.45"
                    />
                  ) : null}
                  {item.points.map((point, pointIndex) => (
                    <g
                      key={`${item.label}-${pointIndex}`}
                      onMouseEnter={() => setActivePointIndex(point.index)}
                      onMouseMove={() => setActivePointIndex(point.index)}
                    >
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="10.5"
                        fill="transparent"
                        className="cursor-pointer"
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={activePointIndex === point.index ? 6.5 : 4.5}
                        fill={item.color}
                        stroke="#fff"
                        strokeWidth="2.2"
                        className="pointer-events-none transition-all duration-200"
                      />
                    </g>
                  ))}
                  {item.payoffPoint ? (
                    <g>
                      <line x1={item.payoffPoint.x} y1={chartData.padding.top} x2={item.payoffPoint.x} y2={chartData.height - chartData.padding.bottom} stroke={item.color} strokeDasharray="6 5" strokeOpacity="0.75" />
                      <circle cx={item.payoffPoint.x} cy={item.payoffPoint.y} r="6" fill={item.color} stroke="#fff" strokeWidth="2.5" />
                      <rect x={item.payoffPoint.x + 8} y={chartData.padding.top + 12} width="180" height="38" rx="10" fill="white" stroke="#e2e8f0" />
                      <text x={item.payoffPoint.x + 20} y={chartData.padding.top + 30} className="fill-slate-700 text-[11px] font-semibold">Payoff {item.payoffDate}</text>
                    </g>
                  ) : null}
                </g>
              ))}
            </svg>
          </div>

          <div className="w-full xl:w-[320px] xl:shrink-0">
            {activeSeriesRows.length > 0 && activePoint ? (
              <div className="rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.4)] backdrop-blur" style={{ animation: "tooltipRise 220ms ease-out both" }}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Loan age {formatYears(activePoint.year)}</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.32em] text-slate-500">Live snapshot</p>
                  </div>
                  <div className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-700">Updated</div>
                </div>
                <div className="mt-3 space-y-2.5 text-sm text-slate-600">
                  {activeSeriesRows.map((row) => (
                    <div key={row.label} className="rounded-[16px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-2.75">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                      </div>
                      <div className="mt-2 grid gap-1.5">
                        <p>Remaining balance: <span className="font-semibold text-slate-900">{formatCurrency(row.balance)}</span></p>
                        <p>Principal repaid: <span className="font-semibold text-slate-900">{formatCurrency(row.principal)}</span></p>
                        <p>Interest paid: <span className="font-semibold text-slate-900">{formatCurrency(row.interest)}</span></p>
                        <p>Payoff date: <span className="font-semibold text-slate-900">{row.payoffDate}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="hidden rounded-[24px] border border-slate-200/80 bg-white/70 p-4 shadow-[0_16px_60px_-30px_rgba(15,23,42,0.25)] xl:block">
                <p className="text-sm font-semibold text-slate-900">Hover a point</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Move over any point on the chart to compare remaining balance, principal repaid, and interest paid.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes dash {
          from {
            stroke-dasharray: 2400;
            stroke-dashoffset: 2400;
            opacity: 0.45;
          }
          to {
            stroke-dasharray: 2400;
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes tooltipRise {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
