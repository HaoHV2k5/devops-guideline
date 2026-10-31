"use client";

import React from "react";
import { Phase, WeekTopic } from "@/data/roadmapData";
import { StickyNoteCard } from "./StickyNoteCard";
import { Layers, CheckCircle2 } from "lucide-react";

interface KanbanViewProps {
  phases: Phase[];
  weeks: WeekTopic[];
  completedWeeks: number[];
  onToggleComplete: (id: number) => void;
  onSelectBreakDebug: (topic: WeekTopic) => void;
  onSelectWhyInterview: (topic: WeekTopic) => void;
  onOpenCommands: (topic: WeekTopic) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  phases,
  weeks,
  completedWeeks,
  onToggleComplete,
  onSelectBreakDebug,
  onSelectWhyInterview,
  onOpenCommands,
}) => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {phases.map((phase) => {
          const phaseWeeks = weeks.filter((w) => w.phaseId === phase.id);
          const completedInPhase = phaseWeeks.filter((w) =>
            completedWeeks.includes(w.id)
          ).length;

          return (
            <div
              key={phase.id}
              className="bg-white/80 backdrop-blur-xs rounded-3xl border-2 border-dashed border-[#c7cad5] p-4 flex flex-col gap-4 shadow-[0_4px_24px_rgba(5,0,56,0.03)]"
            >
              {/* Miro Frame Header */}
              <div className="pb-3 border-b border-[#e0e2e8]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: phase.color }}
                    />
                    <span className="text-xs font-black uppercase tracking-wider text-[#1c1c1e]">
                      {phase.weeks}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f7f8fa] text-[#555a6a] border border-[#e0e2e8]">
                    {completedInPhase}/{phaseWeeks.length} xong
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#1c1c1e]">
                  {phase.title}
                </h3>
                <p className="text-xs text-[#6b6f7e] mt-1 line-clamp-2">
                  {phase.description}
                </p>
              </div>

              {/* Cards Column */}
              <div className="space-y-4">
                {phaseWeeks.map((week, idx) => (
                  <StickyNoteCard
                    key={week.id}
                    topic={week}
                    isCompleted={completedWeeks.includes(week.id)}
                    onToggleComplete={onToggleComplete}
                    onSelectBreakDebug={onSelectBreakDebug}
                    onSelectWhyInterview={onSelectWhyInterview}
                    onOpenCommands={onOpenCommands}
                    rotation={idx % 2 === 0 ? -1 : 1}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
