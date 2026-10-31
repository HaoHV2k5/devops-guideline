"use client";

import React from "react";
import { CheckCircle2, Award, Terminal, HelpCircle, AlertTriangle, BookOpen, Layers } from "lucide-react";
import { Phase } from "@/data/roadmapData";

interface MiroHeaderProps {
  completedCount: number;
  totalWeeks: number;
  activeView: "canvas" | "timeline" | "kanban" | "cheatsheet";
  setActiveView: (view: "canvas" | "timeline" | "kanban" | "cheatsheet") => void;
  selectedPhase: number | null;
  setSelectedPhase: (phaseId: number | null) => void;
  phases: Phase[];
  onOpenBreakDebug: () => void;
  onOpenInterview: () => void;
  onOpenCheatSheet: () => void;
  onOpenResources: () => void;
}

export const MiroHeader: React.FC<MiroHeaderProps> = ({
  completedCount,
  totalWeeks,
  activeView,
  setActiveView,
  selectedPhase,
  setSelectedPhase,
  phases,
  onOpenBreakDebug,
  onOpenInterview,
  onOpenCheatSheet,
  onOpenResources,
}) => {
  const progressPercent = Math.round((completedCount / totalWeeks) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e0e2e8] px-4 lg:px-8 py-3 shadow-[0_2px_8px_rgba(5,0,56,0.04)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          {/* Miro Signature Canary Yellow Wordmark Badge */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#ffd02f] border-2 border-[#1c1c1e] shadow-[2px_2px_0px_#1c1c1e] flex items-center justify-center font-black text-[#1c1c1e] text-lg select-none">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#1c1c1e] tracking-tight">
                  Miro <span className="text-[#6b6f7e] font-normal">x</span> DevOps Guideline
                </span>
                <span className="text-[11px] font-semibold bg-[#fff4c4] text-[#746019] border border-[#fcb900] px-2 py-0.5 rounded-full">
                  Java Backend
                </span>
              </div>
              <p className="text-xs text-[#6b6f7e] hidden sm:block">
                Lộ trình 12 tuần · 1.5–2h/ngày · Từ “làm được” sang “hiểu vì sao”
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 bg-[#f7f8fa] border border-[#e0e2e8] px-3 py-1.5 rounded-full">
          <div className="flex items-center gap-2 text-xs font-medium text-[#2c2c34]">
            <CheckCircle2 className="w-4 h-4 text-[#00b473]" />
            <span>
              Tiến độ: <strong className="text-[#1c1c1e]">{completedCount}/{totalWeeks}</strong> tuần ({progressPercent}%)
            </span>
          </div>
          <div className="w-24 md:w-32 h-2.5 bg-[#e0e2e8] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ffd02f] via-[#0fbcb0] to-[#00b473] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {progressPercent === 100 && (
            <span className="flex items-center text-xs text-[#00b473] font-bold animate-bounce">
              <Award className="w-4 h-4 mr-0.5" /> Sẵn sàng Phỏng vấn!
            </span>
          )}
        </div>

        {/* View Switcher & Action Pills */}
        <div className="flex items-center flex-wrap gap-2">
          {/* View Mode Buttons */}
          <div className="flex items-center bg-[#f7f8fa] p-1 rounded-full border border-[#e0e2e8]">
            <button
              onClick={() => setActiveView("canvas")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                activeView === "canvas"
                  ? "bg-[#1c1c1e] text-white shadow-sm"
                  : "text-[#555a6a] hover:text-[#1c1c1e]"
              }`}
            >
              Miro Board
            </button>
            <button
              onClick={() => setActiveView("timeline")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                activeView === "timeline"
                  ? "bg-[#1c1c1e] text-white shadow-sm"
                  : "text-[#555a6a] hover:text-[#1c1c1e]"
              }`}
            >
              Lộ trình tuần
            </button>
            <button
              onClick={() => setActiveView("kanban")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                activeView === "kanban"
                  ? "bg-[#1c1c1e] text-white shadow-sm"
                  : "text-[#555a6a] hover:text-[#1c1c1e]"
              }`}
            >
              Giai đoạn
            </button>
          </div>

          {/* Quick Drawer Buttons */}
          <button
            onClick={onOpenBreakDebug}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffc6c6]/40 hover:bg-[#ffc6c6] text-[#600000] border border-[#ff9999] text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            title="Kịch bản cố tình làm hỏng để hiểu sâu"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#e11d48]" />
            <span className="hidden sm:inline">Cố tình làm hỏng</span>
            <span className="sm:hidden">Debug</span>
          </button>

          <button
            onClick={onOpenInterview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fff4c4] hover:bg-[#ffd02f] text-[#746019] border border-[#fcb900] text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            title="Luyện tập câu hỏi 'Tại sao?' khi phỏng vấn"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#d97706]" />
            <span className="hidden sm:inline">Phỏng vấn "Tại sao?"</span>
            <span className="sm:hidden">Tại sao?</span>
          </button>

          <button
            onClick={onOpenCheatSheet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1c1e] text-white text-xs font-semibold hover:bg-[#2c2c34] transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="Bảng tra lệnh CLI thường dùng"
          >
            <Terminal className="w-3.5 h-3.5 text-[#ffd02f]" />
            <span className="hidden sm:inline">Cheat Sheet</span>
          </button>

          <button
            onClick={onOpenResources}
            className="p-1.5 rounded-full border border-[#e0e2e8] hover:bg-[#f7f8fa] text-[#555a6a] hover:text-[#1c1c1e] transition-all"
            title="Tài liệu & Labs"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Phase Filter Bar */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-[#f0f2f5] flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        <span className="text-[11px] font-semibold text-[#8e91a0] uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
          <Layers className="w-3 h-3" /> Lọc Phase:
        </span>
        <button
          onClick={() => setSelectedPhase(null)}
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selectedPhase === null
              ? "bg-[#1c1c1e] text-white"
              : "bg-[#f7f8fa] text-[#6b6f7e] hover:bg-[#eef0f3]"
          }`}
        >
          Tất cả (12 tuần)
        </button>
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedPhase === phase.id
                ? "bg-[#1c1c1e] text-white shadow-sm"
                : "bg-white border border-[#e0e2e8] text-[#555a6a] hover:border-[#1c1c1e]"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: phase.color }}
            />
            {phase.weeks}: {phase.title}
          </button>
        ))}
      </div>
    </header>
  );
};
