import React, { useState } from 'react';
import {
  Code,
  Sparkles,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Globe,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { StudentProfile, ProjectEvaluationResult } from '../../types';
import { requestProjectEvaluation } from '../../services/apiClient';

interface ProjectEvaluatorViewProps {
  student: StudentProfile;
}

export const ProjectEvaluatorView: React.FC<ProjectEvaluatorViewProps> = ({
  student,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    student.projects[0]?.id || 'custom'
  );
  const [title, setTitle] = useState(student.projects[0]?.title || '');
  const [techStack, setTechStack] = useState(
    student.projects[0]?.techStack.join(', ') || ''
  );
  const [description, setDescription] = useState(
    student.projects[0]?.description || ''
  );
  const [githubUrl, setGithubUrl] = useState(
    student.projects[0]?.githubUrl || ''
  );
  const [liveUrl, setLiveUrl] = useState(student.projects[0]?.liveUrl || '');
  const [architecture, setArchitecture] = useState(
    'Monolithic MVC backend with Express and React SPA frontend'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<ProjectEvaluationResult | null>(null);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);

  const handleSelectPreloaded = (projId: string) => {
    setSelectedProjectId(projId);
    if (projId === 'custom') {
      setTitle('');
      setTechStack('');
      setDescription('');
      setGithubUrl('');
      setLiveUrl('');
      return;
    }
    const found = student.projects.find((p) => p.id === projId);
    if (found) {
      setTitle(found.title);
      setTechStack(found.techStack.join(', '));
      setDescription(found.description);
      setGithubUrl(found.githubUrl || '');
      setLiveUrl(found.liveUrl || '');
    }
  };

  const handleEvaluate = async () => {
    if (!title.trim() || !techStack.trim() || !description.trim()) return;

    setIsLoading(true);
    try {
      const result = await requestProjectEvaluation({
        title,
        techStack,
        description,
        githubUrl,
        liveUrl,
        architecture,
        targetRole: student.targetRole,
      });
      setEvaluation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Code className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-sans">
                  AI Project Evaluator & Codebase Auditor
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Benchmarks student capstone projects against real-world production criteria (Auth, Redis, Tests, Docker).
                </p>
              </div>
            </div>
          </div>

          {/* Preload Project Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Load from profile:</span>
            <select
              id="select-preloaded-project"
              value={selectedProjectId}
              onChange={(e) => handleSelectPreloaded(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {student.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
              <option value="custom">+ Enter Custom / New Project</option>
            </select>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Title
            </label>
            <input
              id="project-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Campus Mess Delivery System"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Technologies & Frameworks (Comma separated)
            </label>
            <input
              id="project-tech-stack-input"
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="e.g. React, Node.js, Express, MongoDB, Socket.io"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Description & Key Functionalities
            </label>
            <textarea
              id="project-description-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what problem your project solves, target users, and main workflows..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              GitHub Repo Link (Optional)
            </label>
            <input
              id="project-github-input"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/project"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Live Hosted URL (Optional)
            </label>
            <input
              id="project-live-url-input"
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://my-project.vercel.app"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            id="evaluate-project-submit-btn"
            onClick={handleEvaluate}
            disabled={isLoading || !title.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xs disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Auditing Codebase with Gemini...' : 'Audit Project with Gemini AI'}</span>
          </button>
        </div>
      </div>

      {/* Evaluation Results */}
      {evaluation && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center text-indigo-700 font-bold shrink-0">
                <span className="text-2xl font-extrabold">{evaluation.overallScore}</span>
                <span className="text-[10px] uppercase tracking-wider text-indigo-400">Score</span>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Project Readiness Verdict
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {evaluation.verdict}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluation for {student.targetRole} role at {student.targetCompanyTier}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {evaluation.overallScore >= 80 ? (
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Impressive Portfolio Project</span>
                </div>
              ) : (
                <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Needs Production Hardening</span>
                </div>
              )}
            </div>
          </div>

          {/* Two Column Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>What Works Well</span>
              </div>
              <ul className="space-y-2 pt-1 text-xs text-slate-700">
                {evaluation.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Production Features */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Missing Production Features (To Stand Out)</span>
              </div>
              <ul className="space-y-2 pt-1 text-xs text-slate-700">
                {evaluation.missingProductionFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI-Generated High-Impact Resume Bullets */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Optimized Resume Bullet Points (STAR Format)</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Copy and paste directly into your resume to trigger ATS keywords and show measurable metrics.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {evaluation.resumeBulletSuggestions.map((bullet, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs text-slate-800 transition-colors"
                >
                  <p className="leading-relaxed flex-1 font-medium">{bullet}</p>
                  <button
                    id={`copy-bullet-${idx}`}
                    onClick={() => copyBullet(bullet, idx)}
                    className="shrink-0 p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    title="Copy bullet point"
                  >
                    {copiedBulletIdx === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Interviewer Questions Defense Prep */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>Likely Placement Interview Questions on This Project</span>
            </div>
            <p className="text-xs text-slate-300">
              Technical interviewers at Tier-1/2 companies will test whether you really built this or copied it:
            </p>

            <div className="space-y-3 pt-1">
              {evaluation.interviewerQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-xs text-slate-200"
                >
                  <span className="font-bold text-indigo-400 mr-2">Q{idx + 1}:</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
