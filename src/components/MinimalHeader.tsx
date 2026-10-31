"use client";

import React from "react";
import {
  CheckCircle2,
  Terminal,
  HelpCircle,
  BookOpen,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface MinimalHeaderProps {
  completedCount: number;
  totalWeeks: number;
  activeTab: "timeline" | "cheatsheet" | "interview";
  setActiveTab: (tab: "timeline" | "cheatsheet" | "interview") => void;
  onOpenResources: () => void;
  onResetProgress: () => void;
}

export const MinimalHeader: React.FC<MinimalHeaderProps> = ({
  completedCount,
  totalWeeks,
  activeTab,
  setActiveTab,
  onOpenResources,
  onResetProgress,
}) => {
  const percent = Math.round((completedCount / totalWeeks) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2e4e9] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ffd02f] border border-[#1c1c1e] shadow-2xs flex items-center justify-center font-black text-[#1c1c1e] text-base select-none">
            D
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-[#1c1c1e] tracking-tight">
              DevOps Guideline
            </span>
            <span className="text-[11px] font-semibold bg-[#f4f5f7] text-[#4b5563] border border-[#e5e7eb] px-2 py-0.5 rounded-full">
              Java Backend · 12 Tuần
            </span>
          </div>
        </div>

        {/* Center Progress */}
        <div className="flex items-center gap-3 bg-[#f9fafb] border border-[#e5e7eb] px-3.5 py-1.5 rounded-full">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#374151]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Tiến độ: <strong className="text-[#111827]">{completedCount}/{totalWeeks}</strong> tuần ({percent}%)
            </span>
          </div>
          <div className="w-20 md:w-28 h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Nav Tabs & Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#f4f5f7] p-1 rounded-xl border border-[#e5e7eb]">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "timeline"
                  ? "bg-white text-[#111827] shadow-2xs"
                  : "text-[#6b7280] hover:text-[#111827]"
              }`}
            >
              Lộ trình học
            </button>
            <button
              onClick={() => setActiveTab("cheatsheet")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "cheatsheet"
                  ? "bg-white text-[#111827] shadow-2xs"
                  : "text-[#6b7280] hover:text-[#111827]"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#4262ff]" />
              <span>Bảng tra lệnh</span>
            </button>
            <button
              onClick={() => setActiveTab("interview")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "interview"
                  ? "bg-white text-[#111827] shadow-2xs"
                  : "text-[#6b7280] hover:text-[#111827]"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Phỏng vấn "Tại sao?"</span>
            </button>
          </div>

          <button
            onClick={onOpenResources}
            className="p-1.5 rounded-lg border border-[#e5e7eb] hover:bg-[#f9fafb] text-[#6b7280] hover:text-[#111827] transition-all"
            title="Tài liệu & Sách tham khảo"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {completedCount > 0 && (
            <button
              onClick={onResetProgress}
              className="p-1.5 rounded-lg border border-[#e5e7eb] hover:bg-[#f9fafb] text-[#6b7280] hover:text-rose-600 transition-all"
              title="Đặt lại tiến độ"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
