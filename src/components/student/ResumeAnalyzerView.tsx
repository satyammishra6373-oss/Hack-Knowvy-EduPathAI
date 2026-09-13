import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Zap,
} from 'lucide-react';
import { StudentProfile, ResumeAnalysisResult } from '../../types';
import { requestResumeAnalysis } from '../../services/apiClient';

interface ResumeAnalyzerViewProps {
  student: StudentProfile;
}

const SAMPLE_FRESHER_RESUME = `Aarav Sharma
Ghaziabad, Uttar Pradesh | +91 98765 43210 | aarav.sharma@email.com
LinkedIn: linkedin.com/in/aarav-sharma | GitHub: github.com/aarav-sharma

EDUCATION
AKG Engineering College, Ghaziabad (AKTU)
B.Tech in Computer Science and Engineering (2022 - 2026)
CGPA: 8.24 / 10.0

TECHNICAL SKILLS
Languages: C++, JavaScript, Python, SQL
Frontend: React.js, HTML5, CSS3, Tailwind CSS
Backend & DB: Node.js, Express.js, MongoDB
Core Subjects: Data Structures & Algorithms, Object Oriented Programming, DBMS, Operating Systems
Tools: Git, GitHub, VS Code, Postman

PROJECTS
Campus Mess & Food Ordering Application | React, Express, Node.js, MongoDB
- Developed a full stack web app for college hostel students to preorder meals and view mess schedule.
- Built student authentication and vendor order management dashboards.
- Enabled students to pay online and receive meal tokens.

LeetCode Discord Bot | Python, Discord.py
- Created a Discord bot to fetch and display daily LeetCode stats of students in batch.
- Integrated automated leaderboard to keep track of questions solved.
- Bot was used by 100+ students in our computer science batch.

ACHIEVEMENTS & CERTIFICATIONS
- Solved 195+ DSA questions across LeetCode and GeeksforGeeks.
- HackerRank 5 Star in Problem Solving.
- Elite Certificate in NPTEL Programming in C++.`;

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  student,
}) => {
  const [resumeText, setResumeText] = useState(SAMPLE_FRESHER_RESUME);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setIsLoading(true);
    try {
      const result = await requestResumeAnalysis(
        resumeText,
        student.targetRole
      );
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-sans">
                  ATS Resume Scanner & Campus Placement Screener
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluates ATS score, target role keyword alignment, and metric impact for Indian placements.
                </p>
              </div>
            </div>
          </div>

          <button
            id="load-sample-resume-btn"
            onClick={() => setResumeText(SAMPLE_FRESHER_RESUME)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/60 px-3.5 py-2 rounded-xl border border-indigo-200 transition-colors"
          >
            Load Sample Fresher Resume
          </button>
        </div>

        {/* Input Text Area */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>Paste Resume Content (or Markdown)</span>
            <span>Target Role: <strong className="text-slate-900">{student.targetRole}</strong></span>
          </div>
          <textarea
            id="resume-text-input"
            rows={8}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            id="analyze-resume-submit-btn"
            onClick={handleAnalyze}
            disabled={isLoading || !resumeText.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xs disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Scanning with Gemini ATS...' : 'Run Gemini ATS Audit'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div className="space-y-6">
          {/* Top ATS Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center font-bold text-indigo-700">
                <span className="text-xl font-extrabold">{analysis.overallAtsScore}</span>
                <span className="text-[9px] uppercase tracking-wider text-indigo-400">/ 100</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Overall ATS Score
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {analysis.overallAtsScore >= 75 ? 'Passes Shortlist Filter' : 'Risk of Auto-Rejection'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center font-bold text-emerald-700">
                <span className="text-xl font-extrabold">{analysis.targetRoleMatch}%</span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-500">Match</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Target Role Fit
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {student.targetRole}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Placement Readiness
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  Ready for Mass / Tier-2
                </p>
              </div>
            </div>
          </div>

          {/* Keywords Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Keywords */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Detected Industry Keywords</span>
              </div>
              <p className="text-xs text-slate-500">
                These keywords matched your target role and will trigger recruiter search filters.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.detectedKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-lg"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Crucial Missing Keywords (Add to Resume)</span>
              </div>
              <p className="text-xs text-slate-500">
                Recruiters filter by these terms. We recommend incorporating them into projects.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.missingCrucialKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200/80 px-2.5 py-1 rounded-lg"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bullet Point Improvements (Before vs After) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>STAR Format Bullet Point Rewrites</span>
            </h4>
            <p className="text-xs text-slate-500">
              Notice how turning vague statements into quantifiable metrics increases recruiter callback rates by 3x.
            </p>

            <div className="space-y-4 pt-1">
              {analysis.bulletPointImprovements.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden text-xs"
                >
                  <div className="bg-slate-50 p-3 border-b border-slate-200 text-slate-600">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
                      Before (Weak / Passive):
                    </span>
                    <p className="line-through text-slate-500">{item.original}</p>
                  </div>
                  <div className="bg-emerald-50/60 p-3 text-emerald-950">
                    <span className="font-bold text-emerald-700 uppercase text-[10px] tracking-wider block mb-1">
                      After (High Impact / Quantified):
                    </span>
                    <p className="font-medium">{item.improved}</p>
                    <p className="text-[11px] text-emerald-700 mt-1 italic">
                      Why: {item.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Tier Readiness Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900">
              Placement Drive Viability Verdict
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">TCS Digital / Infosys DNP</span>
                <p className="text-slate-600 leading-relaxed">{analysis.placementRoundReadiness.tcsOrMassTest}</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Tier 2 Tech (Zoho, Juspay)</span>
                <p className="text-slate-600 leading-relaxed">{analysis.placementRoundReadiness.tier2Product}</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Tier 1 MNC (Amazon, Swiggy)</span>
                <p className="text-slate-600 leading-relaxed">{analysis.placementRoundReadiness.tier1Product}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
