import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Filter,
  Lightbulb,
  BookOpen,
  RefreshCw,
} from 'lucide-react';
import { FullSkillGapAnalysisResult, StudentProfile, SkillGapItem } from '../../types';

interface SkillGapAnalysisViewProps {
  analysis: FullSkillGapAnalysisResult;
  student: StudentProfile;
  isLoading: boolean;
  onRefreshAnalysis: () => void;
  onNavigateToRoadmap: () => void;
}

export const SkillGapAnalysisView: React.FC<SkillGapAnalysisViewProps> = ({
  analysis,
  student,
  isLoading,
  onRefreshAnalysis,
  onNavigateToRoadmap,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical' | 'Moderate'>('All');

  const filteredGaps = analysis.criticalGaps.filter((gap) => {
    if (severityFilter === 'All') return true;
    return gap.gapSeverity === severityFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header bar with Refresh Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Skill Gap & Industry Readiness Diagnostic
            </h2>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Target: {student.targetRole}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            AI benchmarked against requirements for Indian engineering graduates at {student.targetCompanyTier}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="reanalyze-skills-gemini-btn"
            onClick={onRefreshAnalysis}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xs disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Analyzing with Gemini...' : 'Re-Analyze with Gemini'}</span>
          </button>
        </div>
      </div>

      {/* Summary Narrative Banner */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/60 rounded-2xl border border-indigo-100 p-5">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">
              Diagnostic Verdict & Campus Placement Standing
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {analysis.summary}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-medium text-slate-600">
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                DSA Count: <strong className="text-slate-900">{student.dsaStats.problemsSolved} questions</strong>
              </span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                College: <strong className="text-slate-900">{student.college}</strong>
              </span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                CGPA: <strong className="text-slate-900">{student.cgpa}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Strengths vs Missing High Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Strengths */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Candidate Strengths</span>
          </div>
          <p className="text-xs text-slate-500">
            Assets on your profile that align strongly with Indian placement filters.
          </p>
          <ul className="space-y-2.5 pt-1">
            {analysis.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Good to have & Differentiators */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Off-Campus & Tier-1 Differentiators</span>
          </div>
          <p className="text-xs text-slate-500">
            Skills that convert an interview shortlist into an offer letter.
          </p>
          <ul className="space-y-2.5 pt-1">
            {analysis.goodToHaveSkills.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Skill Gap Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Detailed Skill Gap Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific deficiencies blocking technical clearing rounds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              {(['All', 'Critical', 'Moderate'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSeverityFilter(filter)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    severityFilter === filter
                      ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredGaps.map((gap, index) => {
            const isCritical = gap.gapSeverity === 'Critical';
            return (
              <div
                key={index}
                className="p-5 hover:bg-slate-50/70 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">
                      {gap.skill}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {gap.category}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {gap.gapSeverity} Gap
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Demand:</span>
                    <span className="font-semibold text-indigo-600">{gap.industryDemand}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between font-medium text-slate-500 text-[11px]">
                      <span>Current Level: <strong className="text-slate-800">{gap.currentLevel}</strong></span>
                      <span>Target: <strong className="text-indigo-700">{gap.requiredLevel}</strong></span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      <strong className="text-slate-800 font-medium">Placement Impact: </strong>
                      {gap.impactOnPlacements}
                    </p>
                  </div>

                  <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/70 space-y-1">
                    <p className="text-indigo-950 font-medium text-[11px] flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      Recommended Action:
                    </p>
                    <p className="text-indigo-900 text-xs leading-relaxed">
                      {gap.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to Roadmap */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-600">
            Address these skill gaps in structured weekly milestones.
          </p>
          <button
            id="jump-to-roadmap-btn"
            onClick={onNavigateToRoadmap}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 group"
          >
            <span>View 30/60/90-Day Action Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
