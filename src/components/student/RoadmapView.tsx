import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  ExternalLink,
  Award,
  Sparkles,
  Clock,
  BookOpen,
  ArrowRight,
  Code2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoadmapMilestone } from '../../types';

interface RoadmapViewProps {
  roadmap: RoadmapMilestone[];
  onToggleTask: (phaseIndex: number, taskId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  onToggleTask,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number>(0);

  const currentPhaseData = roadmap[selectedPhase] || roadmap[0];

  // Calculate overall roadmap progress
  let totalTasks = 0;
  let completedTasks = 0;
  roadmap.forEach((phase) => {
    phase.tasks.forEach((t) => {
      totalTasks++;
      if (t.completed) completedTasks++;
    });
  });

  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleTaskClick = (phaseIdx: number, taskId: string, isCurrentlyCompleted: boolean) => {
    onToggleTask(phaseIdx, taskId);
    if (!isCurrentlyCompleted) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Roadmap Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-sans">
                  Personalized 30 / 60 / 90-Day Placement Roadmap
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Milestone-driven action plan synchronized with Indian on-campus & off-campus hiring cycles.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Roadmap Completion
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900">
                  {completionPct}%
                </span>
                <span className="text-[11px] text-slate-400">
                  ({completedTasks}/{totalTasks} tasks)
                </span>
              </div>
            </div>
            <div className="w-24 bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Phase Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
          {roadmap.map((phase, idx) => {
            const phaseTasks = phase.tasks.length;
            const phaseDone = phase.tasks.filter((t) => t.completed).length;
            const isSelected = selectedPhase === idx;

            return (
              <button
                key={idx}
                id={`roadmap-phase-tab-${idx}`}
                onClick={() => setSelectedPhase(idx)}
                className={`text-left p-4 rounded-xl border transition-all relative ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {phase.dayPhase}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {phaseDone}/{phaseTasks} Done
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {phase.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {phase.focusArea}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Phase Details */}
      {currentPhaseData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tasks Checklist (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Active Phase Focus
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {currentPhaseData.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {currentPhaseData.focusArea}
                </p>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Weekly Action Tasks
                </h4>
                {currentPhaseData.tasks.map((task) => (
                  <div
                    key={task.id}
                    id={`task-item-${task.id}`}
                    onClick={() => handleTaskClick(selectedPhase, task.id, task.completed)}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      task.completed
                        ? 'bg-emerald-50/40 border-emerald-200 text-slate-600'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-900'
                    }`}
                  >
                    <button className="mt-0.5 shrink-0 text-indigo-600">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-600" />
                      )}
                    </button>
                    <div className="flex-1 text-xs">
                      <p className={`font-medium leading-relaxed ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {task.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                          {task.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Est. ~{task.estimatedHours} hrs
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phase Deliverable Milestone Card */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 mt-4">
                <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Phase Milestone Deliverable
                  </h5>
                  <p className="text-xs text-amber-950 font-medium mt-1 leading-relaxed">
                    {currentPhaseData.keyDeliverable}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Curated Resources Sidebar (1 col) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Recommended Prep Resources</span>
              </div>
              <p className="text-xs text-slate-500">
                Indian college student favorites: vetted free resources, SDE sheets & video walkthroughs.
              </p>

              <div className="space-y-3 pt-1">
                {currentPhaseData.recommendedResources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {res.platform}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {res.title}
                    </p>
                    <span className="text-[11px] text-slate-400 mt-1 inline-block">
                      Type: {res.type}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Indian Placement Tip Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Placement Hack</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Consistency trumps sporadic bingeing. Solving <strong>2 Medium LeetCode problems every morning</strong> before college lectures yields 180 solved questions in 90 days.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
