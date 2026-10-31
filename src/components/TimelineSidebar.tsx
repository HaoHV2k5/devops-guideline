"use client";

import React from "react";
import { Check, CheckCircle2, Circle } from "lucide-react";
import { Phase, WeekTopic } from "@/data/roadmapData";

interface TimelineSidebarProps {
  phases: Phase[];
  weeks: WeekTopic[];
  completedWeeks: number[];
  selectedPhase: number | null;
  onSelectPhase: (phaseId: number | null) => void;
  activeWeekId: number | null;
}

export const TimelineSidebar: React.FC<TimelineSidebarProps> = ({
  phases,
  weeks,
  completedWeeks,
  selectedPhase,
  onSelectPhase,
  activeWeekId,
}) => {
  const scrollToWeek = (weekNumber: number) => {
    const el = document.getElementById(`week-${weekNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Timeline Nav Box */}
      <div className="bg-white rounded-2xl border border-[#e2e4e9] p-4 lg:sticky lg:top-24 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0f2f5] mb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#1c1c1e]">
            Mục lục 12 Tuần
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {completedWeeks.length}/{weeks.length} Đã xong
          </span>
        </div>

        {/* Phase filter buttons */}
        <div className="mb-4 flex flex-wrap gap-1">
          <button
            onClick={() => onSelectPhase(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedPhase === null
                ? "bg-[#1c1c1e] text-white"
                : "bg-[#f4f5f7] text-[#6b6f7e] hover:text-[#1c1c1e]"
            }`}
          >
            Tất cả
          </button>
          {phases.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPhase(selectedPhase === p.id ? null : p.id)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                selectedPhase === p.id
                  ? "bg-[#1c1c1e] text-white"
                  : "bg-[#f4f5f7] text-[#6b6f7e] hover:text-[#1c1c1e]"
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              P{p.id}
            </button>
          ))}
        </div>

        {/* Timeline list */}
        <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {phases
            .filter((p) => selectedPhase === null || selectedPhase === p.id)
            .map((phase) => {
              const phaseWeeks = weeks.filter((w) => w.phaseId === phase.id);

              return (
                <div key={phase.id} className="space-y-1.5">
                  <div className="text-[11px] font-bold text-[#8e91a0] uppercase tracking-wider flex items-center gap-1.5 px-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: phase.color }}
                    />
                    <span>{phase.weeks}</span>
                  </div>

                  <div className="space-y-1">
                    {phaseWeeks.map((week) => {
                      const isDone = completedWeeks.includes(week.id);
                      const isCurrent = activeWeekId === week.id;

                      return (
                        <button
                          key={week.id}
                          onClick={() => scrollToWeek(week.weekNumber)}
                          className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between group ${
                            isCurrent
                              ? "bg-[#1c1c1e] text-white font-semibold"
                              : "hover:bg-[#f4f5f7] text-[#374151]"
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden pr-2">
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] shrink-0 font-bold ${
                                isDone
                                  ? "bg-emerald-600 text-white"
                                  : isCurrent
                                  ? "bg-white text-[#1c1c1e]"
                                  : "bg-[#e5e7eb] text-[#374151]"
                              }`}
                            >
                              {week.weekNumber}
                            </span>
                            <span className="truncate">{week.title.split(":")[0]}</span>
                          </div>

                          {isDone ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </aside>
  );
};
