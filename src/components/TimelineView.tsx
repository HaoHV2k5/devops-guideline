"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Coffee,
  AlertTriangle,
  HelpCircle,
  Terminal,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { WeekTopic, Phase } from "@/data/roadmapData";

interface TimelineViewProps {
  weeks: WeekTopic[];
  completedWeeks: number[];
  onToggleComplete: (id: number) => void;
  onSelectBreakDebug: (topic: WeekTopic) => void;
  onSelectWhyInterview: (topic: WeekTopic) => void;
  onOpenCommands: (topic: WeekTopic) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  weeks,
  completedWeeks,
  onToggleComplete,
  onSelectBreakDebug,
  onSelectWhyInterview,
  onOpenCommands,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="relative pl-6 md:pl-8 border-l-2 border-[#e0e2e8] space-y-10">
        {weeks.map((topic, index) => {
          const isDone = completedWeeks.includes(topic.id);

          return (
            <div key={topic.id} className="relative group">
              {/* Timeline Indicator Dot */}
              <button
                onClick={() => onToggleComplete(topic.id)}
                className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all bg-white ${
                  isDone
                    ? "border-[#00b473] bg-[#00b473] text-white shadow-sm scale-110"
                    : "border-[#8e91a0] hover:border-[#1c1c1e] text-transparent"
                }`}
                title={isDone ? "Đã xong (click để hủy)" : "Click để đánh dấu hoàn thành"}
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </button>

              {/* Week Card */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e0e2e8] shadow-[0_4px_20px_rgba(5,0,56,0.04)] hover:shadow-[0_12px_32px_rgba(5,0,56,0.08)] transition-all">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-[#1c1c1e] text-white">
                      Tuần {topic.weekNumber}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f7f8fa] border border-[#e0e2e8] text-[#555a6a]">
                      {topic.phaseName}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#6b6f7e] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {topic.duration}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-[#1c1c1e] mb-2">
                  {topic.title}
                </h3>
                <p className="text-sm text-[#555a6a] mb-4 leading-relaxed">
                  {topic.tagline}
                </p>

                {/* Java Backend Spotlight */}
                <div className="mb-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                  <Coffee className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-0.5">
                      Góc nhìn Kỹ sư Java Backend
                    </h4>
                    <p className="text-xs md:text-sm text-[#2c2c34] leading-relaxed">
                      {topic.javaSpecificFocus}
                    </p>
                  </div>
                </div>

                {/* Core Concepts */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b6f7e] mb-2">
                    Kiến thức & Kỹ năng cốt lõi:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {topic.coreConcepts.map((concept, cIdx) => (
                      <li
                        key={cIdx}
                        className="text-xs text-[#2c2c34] bg-[#f7f8fa] p-2.5 rounded-xl border border-[#eef0f3] flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1c1c1e] shrink-0 mt-1.5" />
                        <span>{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Action Bar */}
                <div className="pt-4 border-t border-[#f0f2f5] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectBreakDebug(topic)}
                      className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Cố tình làm hỏng
                    </button>
                    <button
                      onClick={() => onSelectWhyInterview(topic)}
                      className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Hỏi "Tại sao?"
                    </button>
                    <button
                      onClick={() => onOpenCommands(topic)}
                      className="px-3 py-1.5 rounded-full bg-[#f7f8fa] hover:bg-[#eef0f3] text-[#1c1c1e] border border-[#e0e2e8] text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Terminal className="w-3.5 h-3.5" /> Cheat Sheet
                    </button>
                  </div>

                  <button
                    onClick={() => onToggleComplete(topic.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isDone
                        ? "bg-[#00b473] text-white"
                        : "bg-[#1c1c1e] text-white hover:bg-[#2c2c34]"
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã hoàn thành
                      </>
                    ) : (
                      <>Đánh dấu hoàn thành</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
