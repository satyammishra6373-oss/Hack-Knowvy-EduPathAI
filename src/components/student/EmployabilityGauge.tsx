import React from 'react';
import { Target, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface EmployabilityGaugeProps {
  score: number;
  targetRole: string;
  breakdown: {
    dsa: number;
    technicalDepth: number;
    coreCS: number;
    projectsQuality: number;
    softSkills: number;
  };
}

export const EmployabilityGauge: React.FC<EmployabilityGaugeProps> = ({
  score,
  targetRole,
  breakdown,
}) => {
  // Gauge color based on Indian placement tiers
  let statusColor = 'text-amber-600 bg-amber-50 border-amber-200';
  let statusText = 'Needs Targeted Polish (Tier-2/3 Ready)';
  if (score >= 80) {
    statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    statusText = 'Tier-1 Product Placement Ready';
  } else if (score < 60) {
    statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
    statusText = 'Critical Placement Skill Gaps';
  }

  // Circular progress calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
        {/* Main Gauge Graphic */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-slate-100 stroke-current"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-indigo-600 stroke-current transition-all duration-1000 ease-out"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {score}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                / 100
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                Employability Score
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {targetRole}
            </h3>
            <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg text-xs font-semibold border ${statusColor}`}>
              {score >= 80 ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              <span>{statusText}</span>
            </div>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="w-full lg:w-96 space-y-3 pt-2 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-8">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600">DSA & Problem Solving</span>
              <span className="font-semibold text-slate-900">{breakdown.dsa}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.dsa}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600">Technical Depth & Frameworks</span>
              <span className="font-semibold text-slate-900">{breakdown.technicalDepth}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.technicalDepth}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600">Core CS (OS, DBMS, Networks)</span>
              <span className="font-semibold text-slate-900">{breakdown.coreCS}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.coreCS}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600">Project Quality & Production Readiness</span>
              <span className="font-semibold text-slate-900">{breakdown.projectsQuality}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.projectsQuality}%` }}
              />
            </div>
          </div>
        </div>

        {/* Company Cutoff Benchmarks */}
        <div className="w-full lg:w-64 bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs">
          <p className="font-bold text-slate-800 mb-2 flex items-center justify-between">
            <span>Industry Cutoffs</span>
            <Target className="w-4 h-4 text-slate-400" />
          </p>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center justify-between pb-1.5 border-b border-slate-200">
              <span>Tier 1 (Amazon, Swiggy)</span>
              <span className="font-semibold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">82+</span>
            </li>
            <li className="flex items-center justify-between pb-1.5 border-b border-slate-200">
              <span>Tier 2 (Zoho, Juspay)</span>
              <span className="font-semibold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">70+</span>
            </li>
            <li className="flex items-center justify-between">
              <span>TCS Digital / Infosys DNP</span>
              <span className="font-semibold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">60+</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
