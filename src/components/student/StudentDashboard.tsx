import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  Compass,
  FileText,
  Code,
  Mic,
  HelpCircle,
  Bot,
  Layers,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { StudentProfile, FullSkillGapAnalysisResult } from '../../types';
import { EmployabilityGauge } from './EmployabilityGauge';
import { SkillGapAnalysisView } from './SkillGapAnalysisView';
import { RoadmapView } from './RoadmapView';
import { AIMentorView } from './AIMentorView';
import { ProjectEvaluatorView } from './ProjectEvaluatorView';
import { ResumeAnalyzerView } from './ResumeAnalyzerView';
import { MockInterviewView } from './MockInterviewView';
import { AssessmentQuizView } from './AssessmentQuizView';

interface StudentDashboardProps {
  student: StudentProfile;
  analysis: FullSkillGapAnalysisResult;
  isLoadingAnalysis: boolean;
  onRefreshAnalysis: () => void;
  onUpdateTask: (phaseIndex: number, taskId: string) => void;
  onOpenProfileEdit: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  analysis,
  isLoadingAnalysis,
  onRefreshAnalysis,
  onUpdateTask,
  onOpenProfileEdit,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'skill-gap'
    | 'roadmap'
    | 'ai-mentor'
    | 'project-evaluator'
    | 'resume-analyzer'
    | 'mock-interview'
    | 'assessments'
  >('overview');

  const tabs = [
    { id: 'overview', label: 'Overview & Score', icon: Target },
    { id: 'skill-gap', label: 'Skill Gap Matrix', icon: Layers },
    { id: 'roadmap', label: '30/60/90-Day Roadmap', icon: Calendar },
    { id: 'ai-mentor', label: 'AI Placement Coach', icon: Bot },
    { id: 'project-evaluator', label: 'Project Evaluator', icon: Code },
    { id: 'resume-analyzer', label: 'ATS Resume Scanner', icon: FileText },
    { id: 'mock-interview', label: 'Mock Interview', icon: Mic },
    { id: 'assessments', label: 'Skill Assessment', icon: HelpCircle },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Student Profile Quick Hero */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {student.name}
                </h1>
                <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {student.branch} • {student.year}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {student.college} • CGPA: <strong className="text-slate-800">{student.cgpa}</strong>
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                <span>
                  Targeting: <strong className="text-indigo-700 font-semibold">{student.targetRole}</strong>
                </span>
                <span>•</span>
                <span className="text-slate-500">{student.targetCompanyTier}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="student-edit-profile-btn"
              onClick={onOpenProfileEdit}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Edit Career Target
            </button>
            <button
              id="refresh-student-analysis-btn"
              onClick={onRefreshAnalysis}
              disabled={isLoadingAnalysis}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center gap-1.5 disabled:opacity-60 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoadingAnalysis ? 'Analyzing...' : 'Refresh AI Diagnostic'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`student-subtab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Employability Score Gauge */}
          <EmployabilityGauge
            score={analysis.employabilityScore}
            targetRole={student.targetRole}
            breakdown={analysis.scoreBreakdown}
          />

          {/* Quick Metrics & Callouts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Critical Gap Snapshot */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Top Placement Blockers
                </span>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                  {analysis.criticalGaps.length} Gaps
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Skills causing candidate rejections in technical rounds:
              </p>
              <ul className="space-y-2 pt-1 text-xs text-slate-700">
                {analysis.criticalGaps.slice(0, 3).map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900">{gap.skill}</span>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{gap.impactOnPlacements}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setActiveTab('skill-gap')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 pt-2 group"
              >
                <span>Explore Full Gap Analysis</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 30/60/90 Day Next Tasks */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Next Priority Milestones
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  Phase 1 Focus
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Immediate actions for this week's study schedule:
              </p>
              <ul className="space-y-2 pt-1 text-xs text-slate-700">
                {analysis.roadmap[0]?.tasks.slice(0, 3).map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span className={task.completed ? 'line-through text-slate-400' : 'font-medium'}>
                      {task.description}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setActiveTab('roadmap')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 pt-2 group"
              >
                <span>Open Interactive Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Quick Practice Hub */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  AI Placement Modules
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Jump into targeted tools to boost your employability score:
              </p>
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setActiveTab('project-evaluator')}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-xs flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Audit Capstone Project</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('resume-analyzer')}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-xs flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Scan Resume for ATS</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('mock-interview')}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-xs flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Practice Mock Interview</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Campus Placement Tips from Gemini */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Campus Placement Strategy & Insider Tips</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {analysis.placementTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 p-3.5 rounded-xl border border-white/10 text-xs text-slate-200 leading-relaxed"
                >
                  <span className="text-indigo-300 font-bold mr-1.5">Tip #{idx + 1}:</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'skill-gap' && (
        <SkillGapAnalysisView
          analysis={analysis}
          student={student}
          isLoading={isLoadingAnalysis}
          onRefreshAnalysis={onRefreshAnalysis}
          onNavigateToRoadmap={() => setActiveTab('roadmap')}
        />
      )}

      {activeTab === 'roadmap' && (
        <RoadmapView
          roadmap={analysis.roadmap}
          onToggleTask={onUpdateTask}
        />
      )}

      {activeTab === 'ai-mentor' && (
        <AIMentorView student={student} />
      )}

      {activeTab === 'project-evaluator' && (
        <ProjectEvaluatorView student={student} />
      )}

      {activeTab === 'resume-analyzer' && (
        <ResumeAnalyzerView student={student} />
      )}

      {activeTab === 'mock-interview' && (
        <MockInterviewView student={student} />
      )}

      {activeTab === 'assessments' && (
        <AssessmentQuizView />
      )}
    </div>
  );
};
