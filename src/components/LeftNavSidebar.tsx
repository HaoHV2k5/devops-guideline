"use client";

import React, { useEffect, useState } from "react";
import { Check, Layers, ChevronRight, CheckCircle2 } from "lucide-react";
import { Phase, WeekTopic } from "@/data/roadmapData";

interface LeftNavSidebarProps {
  phases: Phase[];
  weeks: WeekTopic[];
  completedWeeks: number[];
  selectedPhase: number | null;
  onSelectPhase: (phaseId: number | null) => void;
  completedConceptsMap?: Record<number, number>;
}

export const LeftNavSidebar: React.FC<LeftNavSidebarProps> = ({
  phases,
  weeks,
  completedWeeks,
  selectedPhase,
  onSelectPhase,
  completedConceptsMap = {},
}) => {
  const [activeWeekId, setActiveWeekId] = useState<number>(1);

  // Scroll spy to highlight active week in sidebar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (let i = weeks.length - 1; i >= 0; i--) {
        const week = weeks[i];
        const el = document.getElementById(`week-${week.weekNumber}`);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveWeekId(week.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [weeks]);

  const scrollToWeek = (weekNumber: number) => {
    const el = document.getElementById(`week-${weekNumber}`);
    if (el) {
      const offsetTop = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      setActiveWeekId(weekNumber);
    }
  };

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-20 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs max-h-[calc(100vh-6rem)] overflow-y-auto space-y-4">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <span>Lộ trình 12 Tuần</span>
            </h2>
            <span className="text-[11px] text-slate-500">Mục lục điều hướng</span>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {completedWeeks.length}/{weeks.length} tuần
          </span>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex flex-wrap gap-1 pb-1">
          <button
            onClick={() => onSelectPhase(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedPhase === null
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
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
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span>P{p.id}</span>
            </button>
          ))}
        </div>

        {/* Weeks List Grouped by Phase */}
        <div className="space-y-4">
          {phases
            .filter((p) => selectedPhase === null || selectedPhase === p.id)
            .map((phase) => {
              const phaseWeeks = weeks.filter((w) => w.phaseId === phase.id);

              return (
                <div key={phase.id} className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: phase.color }}
                    />
                    <span>{phase.weeks}</span>
                  </div>

                  <div className="space-y-1">
                    {phaseWeeks.map((week) => {
                      const isDone = completedWeeks.includes(week.id);
                      const isActive = activeWeekId === week.id;
                      const doneConcepts = completedConceptsMap[week.id] || 0;
                      const totalConcepts = week.coreConcepts.length;

                      return (
                        <button
                          key={week.id}
                          onClick={() => scrollToWeek(week.weekNumber)}
                          className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center justify-between group ${
                            isActive
                              ? "bg-slate-900 text-white font-semibold shadow-2xs"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden pr-1.5">
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold shrink-0 transition-all ${
                                isDone
                                  ? "bg-emerald-600 text-white"
                                  : isActive
                                  ? "bg-white text-slate-900"
                                  : "bg-slate-200 text-slate-700 group-hover:bg-slate-300"
                              }`}
                            >
                              {week.weekNumber}
                            </span>
                            <span className="truncate text-xs">
                              {week.title.split(":")[0]}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {doneConcepts > 0 && !isDone && (
                              <span
                                className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded ${
                                  isActive
                                    ? "bg-slate-800 text-slate-300"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {doneConcepts}/{totalConcepts}
                              </span>
                            )}
                            {isDone ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                            ) : null}
                          </div>
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
