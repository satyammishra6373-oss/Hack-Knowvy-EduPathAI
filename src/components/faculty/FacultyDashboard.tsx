import React, { useState } from 'react';
import {
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Download,
  Calendar,
  Sparkles,
  BarChart3,
  Award,
  BookOpen,
  Send,
  Check,
} from 'lucide-react';
import { SAMPLE_DEPARTMENT_ANALYTICS } from '../../data/mockData';
import { DepartmentAnalytics } from '../../types';

export const FacultyDashboard: React.FC = () => {
  const [departments] = useState<DepartmentAnalytics[]>(SAMPLE_DEPARTMENT_ANALYTICS);
  const [selectedDeptName, setSelectedDeptName] = useState<string>(
    departments[0].department
  );
  const [isBroadcastSent, setIsBroadcastSent] = useState(false);
  const [broadcastText, setBroadcastText] = useState(
    'Reminder to all 3rd year CSE & IT students: Mandatory HackerRank Mock OA test this Saturday at 10 AM. Focus topics: Dynamic Programming and Trees.'
  );

  const selectedDept =
    departments.find((d) => d.department === selectedDeptName) || departments[0];

  // College-wide roll-up metrics
  const totalCollegeStudents = departments.reduce((acc, d) => acc + d.totalStudents, 0);
  const overallAvgScore = (
    departments.reduce((acc, d) => acc + d.averageEmployabilityScore * d.totalStudents, 0) /
    totalCollegeStudents
  ).toFixed(1);

  const totalTier1 = departments.reduce((acc, d) => acc + d.placementEligibilityStats.tier1Eligible, 0);
  const totalTier2 = departments.reduce((acc, d) => acc + d.placementEligibilityStats.tier2Eligible, 0);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setIsBroadcastSent(true);
    setTimeout(() => setIsBroadcastSent(false), 3500);
  };

  const handleExportReport = () => {
    const csvContent =
      'Department,Total Students,Average Score,Ready (%),Needs Polish (%),Critical Gaps (%)\n' +
      departments
        .map(
          (d) =>
            `"${d.department}",${d.totalStudents},${d.averageEmployabilityScore},${d.readinessDistribution.placementReady},${d.readinessDistribution.needsPolish},${d.readinessDistribution.criticalGaps}`
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EduPath_Placement_Readiness_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Faculty Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                College Placement Cell & Training Officer (TPO) Dashboard
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Batch 2026 employability intelligence, department skill gaps, and industry recruitment alignment.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="export-tpo-report-btn"
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Placement Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* College Wide KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Enrolled Students
            </span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {totalCollegeStudents}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Across 4 Engineering Departments</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              College Average Readiness
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {overallAvgScore} <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </p>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            +4.2 pts improvement from last semester
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tier-1 Product Eligible
            </span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {totalTier1} <span className="text-xs font-medium text-slate-400">Students</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Cleared &gt;80 score benchmark for Amazon/Google
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tier-2 & Startup Ready
            </span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {totalTier2} <span className="text-xs font-medium text-slate-400">Students</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Cleared &gt;70 benchmark for Zoho/Juspay
          </p>
        </div>
      </div>

      {/* Department Tab Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {departments.map((dept) => {
          const isSelected = dept.department === selectedDeptName;
          return (
            <button
              key={dept.department}
              id={`dept-tab-${dept.department.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedDeptName(dept.department)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{dept.department}</span>
              <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-600'}`}>
                {dept.averageEmployabilityScore} avg
              </span>
            </button>
          );
        })}
      </div>

      {/* Department Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Readiness Distribution & Top Missing Skills */}
        <div className="lg:col-span-2 space-y-6">
          {/* Readiness Distribution Bar Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedDept.department} — Placement Readiness Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Based on recent assessment test data, DSA tracking, and capstone project audits.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                {selectedDept.totalStudents} Candidates
              </span>
            </div>

            {/* Segmented Stacked Bar */}
            <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${selectedDept.readinessDistribution.placementReady}%` }}
                title={`Placement Ready: ${selectedDept.readinessDistribution.placementReady}%`}
              />
              <div
                className="bg-amber-400 h-full"
                style={{ width: `${selectedDept.readinessDistribution.needsPolish}%` }}
                title={`Needs Polish: ${selectedDept.readinessDistribution.needsPolish}%`}
              />
              <div
                className="bg-rose-500 h-full"
                style={{ width: `${selectedDept.readinessDistribution.criticalGaps}%` }}
                title={`Critical Gaps: ${selectedDept.readinessDistribution.criticalGaps}%`}
              />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-950">
                    {selectedDept.readinessDistribution.placementReady}% Ready
                  </p>
                  <p className="text-[11px] text-emerald-700">Tier 1/2 Shortlist ready</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-amber-950">
                    {selectedDept.readinessDistribution.needsPolish}% Polish Needed
                  </p>
                  <p className="text-[11px] text-amber-700">Tier 3 / Mass ready</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                <div>
                  <p className="font-bold text-rose-950">
                    {selectedDept.readinessDistribution.criticalGaps}% At Risk
                  </p>
                  <p className="text-[11px] text-rose-700">Critical skill deficit</p>
                </div>
              </div>
            </div>
          </div>

          {/* Department Skill Gap Heatmap */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Department-Level Skill Gaps</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Skills where more than 40% of the batch fails technical interview filters.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {selectedDept.topMissingSkills.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {gap.skill}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          gap.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : gap.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {gap.priority} Priority
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Impacts Online Coding Assessment (OA) pass rate by ~35%.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-600">
                        {gap.percentageMissing}%
                      </span>
                      <p className="text-[10px] text-slate-400">Students Lacking</p>
                    </div>
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-rose-500 h-2 rounded-full"
                        style={{ width: `${gap.percentageMissing}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 col: TPO Placement Action Items & Student Broadcast */}
        <div className="space-y-6">
          {/* AI Placement Cell Action Plan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Recommended TPO Interventions</span>
            </div>
            <p className="text-xs text-slate-500">
              AI-suggested workshops to bridge the top department gaps before placement drive.
            </p>

            <ul className="space-y-2.5 pt-1 text-xs">
              <li className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-indigo-950">
                <span className="font-bold block">1. 3-Day Dynamic Programming Bootcamp:</span>
                <span className="text-[11px] text-indigo-800">
                  Target: 64% of batch struggling with 2-D DP and recursion memoization.
                </span>
              </li>
              <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                <span className="font-bold block">2. System Design & Low Level Design Lab:</span>
                <span className="text-[11px] text-slate-600">
                  Hands-on machine coding: Parking Lot & Splitwise object modeling in C++/Java.
                </span>
              </li>
              <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                <span className="font-bold block">3. Docker & AWS Deployment Session:</span>
                <span className="text-[11px] text-slate-600">
                  Helps upgrade college projects to live containerized cloud URLs.
                </span>
              </li>
            </ul>
          </div>

          {/* Broadcast Placement Task to Department */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Send className="w-4 h-4 text-indigo-600" />
              <span>Broadcast Placement Notice</span>
            </div>
            <p className="text-xs text-slate-500">
              Push notifications directly to student roadmap dashboards.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-3 pt-1">
              <textarea
                id="tpo-broadcast-input"
                rows={4}
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden leading-relaxed"
              />
              <button
                id="send-broadcast-btn"
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                {isBroadcastSent ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Broadcast Sent to {selectedDept.department}!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Announcement to Batch</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
