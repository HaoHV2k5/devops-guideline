"use client";

import React, { useRef } from "react";
import confetti from "canvas-confetti";
import {
  Check,
  AlertTriangle,
  HelpCircle,
  Clock,
  Terminal,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Coffee,
} from "lucide-react";
import { WeekTopic } from "@/data/roadmapData";

interface StickyNoteCardProps {
  topic: WeekTopic;
  isCompleted: boolean;
  onToggleComplete: (id: number) => void;
  onSelectBreakDebug: (topic: WeekTopic) => void;
  onSelectWhyInterview: (topic: WeekTopic) => void;
  onOpenCommands: (topic: WeekTopic) => void;
  rotation?: number;
}

export const StickyNoteCard: React.FC<StickyNoteCardProps> = ({
  topic,
  isCompleted,
  onToggleComplete,
  onSelectBreakDebug,
  onSelectWhyInterview,
  onOpenCommands,
  rotation = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      // Fire celebration confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#ffd02f", "#0fbcb0", "#4262ff", "#ff9999"],
      });
    }
    onToggleComplete(topic.id);
  };

  // Color mapping based on Miro pastel sticky notes
  const colorThemes = {
    yellow: {
      bg: "bg-[#fff9d2]",
      border: "border-[#fcb900]/60",
      accent: "bg-[#ffd02f]",
      textDark: "text-[#746019]",
      tapeBg: "bg-amber-100/60",
      badgeBg: "bg-[#fff4c4] text-[#746019] border-[#fcb900]",
    },
    teal: {
      bg: "bg-[#e2faf8]",
      border: "border-[#0fbcb0]/50",
      accent: "bg-[#0fbcb0]",
      textDark: "text-[#187574]",
      tapeBg: "bg-teal-100/60",
      badgeBg: "bg-[#c3faf5] text-[#187574] border-[#0fbcb0]",
    },
    coral: {
      bg: "bg-[#ffeaea]",
      border: "border-[#ff9999]/60",
      accent: "bg-[#ff9999]",
      textDark: "text-[#600000]",
      tapeBg: "bg-rose-100/60",
      badgeBg: "bg-[#ffc6c6] text-[#600000] border-[#ff9999]",
    },
    rose: {
      bg: "bg-[#fef0f9]",
      border: "border-[#ffd8f4]/80",
      accent: "bg-[#f48fb1]",
      textDark: "text-[#880e4f]",
      tapeBg: "bg-pink-100/60",
      badgeBg: "bg-[#ffd8f4] text-[#880e4f] border-[#f48fb1]",
    },
    blue: {
      bg: "bg-[#f0f3ff]",
      border: "border-[#5b76fe]/40",
      accent: "bg-[#4262ff]",
      textDark: "text-[#1a237e]",
      tapeBg: "bg-blue-100/60",
      badgeBg: "bg-[#f5f3ff] text-[#4262ff] border-[#5b76fe]",
    },
    orange: {
      bg: "bg-[#fff3e6]",
      border: "border-[#f39c12]/50",
      accent: "bg-[#e67e22]",
      textDark: "text-[#7e3f00]",
      tapeBg: "bg-orange-100/60",
      badgeBg: "bg-[#ffe6cd] text-[#7e3f00] border-[#f39c12]",
    },
  };

  const theme = colorThemes[topic.stickyColor] || colorThemes.yellow;

  return (
    <div
      ref={cardRef}
      id={`week-card-${topic.weekNumber}`}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      className={`group relative rounded-2xl border ${theme.border} ${theme.bg} p-5 md:p-6 shadow-[0_6px_20px_rgba(5,0,56,0.06),0_1px_3px_rgba(5,0,56,0.03)] transition-all duration-300 hover:rotate-0 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(5,0,56,0.12)] flex flex-col justify-between`}
    >
      {/* Miro Washi Tape Accent on Top */}
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 ${theme.tapeBg} border border-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-[2px] backdrop-blur-[1px] rotate-[-1deg] pointer-events-none z-10 opacity-80`}
      />

      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Week Badge */}
            <span className="font-extrabold text-xs px-2.5 py-1 rounded-full bg-[#1c1c1e] text-white tracking-wide shadow-sm flex items-center gap-1">
              Tuần {topic.weekNumber}
            </span>
            {/* Phase Tag */}
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${theme.badgeBg}`}
            >
              {topic.phaseName}
            </span>
          </div>

          {/* Complete Toggle Checkbox */}
          <button
            onClick={handleCheckboxClick}
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
              isCompleted
                ? "bg-[#00b473] border-[#00b473] text-white shadow-sm scale-110"
                : "border-[#8e91a0]/40 bg-white/70 hover:border-[#1c1c1e]"
            }`}
            title={isCompleted ? "Đã hoàn thành! Click để bỏ chọn" : "Đánh dấu đã hoàn thành"}
          >
            {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : null}
          </button>
        </div>

        {/* Title & Tagline */}
        <h3 className="font-bold text-lg md:text-xl text-[#1c1c1e] leading-snug tracking-tight mb-1.5">
          {topic.title}
        </h3>
        <p className="text-xs text-[#555a6a] line-clamp-2 mb-3 leading-relaxed">
          {topic.tagline}
        </p>

        {/* Java Backend Focus Banner */}
        <div className="mb-3.5 p-2.5 rounded-xl bg-white/75 border border-black/5 flex items-start gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Coffee className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-[#2c2c34] leading-relaxed">
            <strong className="text-amber-900 font-semibold">Góc nhìn Java: </strong>
            {topic.javaSpecificFocus}
          </div>
        </div>

        {/* Core Concepts */}
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#6b6f7e] mb-1.5 flex items-center gap-1">
            <span>Trọng tâm kiến thức</span>
          </div>
          <ul className="space-y-1.5">
            {topic.coreConcepts.slice(0, 3).map((concept, idx) => (
              <li
                key={idx}
                className="text-xs text-[#2c2c34] flex items-start gap-1.5 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1c1c1e] shrink-0 mt-1.5" />
                <span className="line-clamp-2">{concept}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {topic.skills.map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium bg-white/80 border border-black/5 text-[#555a6a] px-2 py-0.5 rounded-md"
            >
              #{skill}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer / Action Buttons */}
      <div className="pt-3 border-t border-black/5 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Break & Debug Trigger */}
          <button
            onClick={() => onSelectBreakDebug(topic)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white/90 hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Thực hành: Cố tình làm hỏng & Debug"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="truncate">Cố tình làm hỏng</span>
          </button>

          {/* Why Questions Trigger */}
          <button
            onClick={() => onSelectWhyInterview(topic)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white/90 hover:bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Luyện tập phỏng vấn câu hỏi 'Tại sao?'"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">Hỏi "Tại sao?"</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#6b6f7e] pt-1">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" /> {topic.duration}
          </span>
          <button
            onClick={() => onOpenCommands(topic)}
            className="flex items-center gap-1 font-semibold text-[#1c1c1e] hover:underline"
          >
            <Terminal className="w-3 h-3" /> Lệnh tuần {topic.weekNumber}
          </button>
        </div>
      </div>
    </div>
  );
};
