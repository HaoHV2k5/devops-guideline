"use client";

import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  Bug,
  Search,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { WeekTopic, ROADMAP_WEEKS } from "@/data/roadmapData";

interface BreakAndDebugModalProps {
  initialTopic: WeekTopic | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BreakAndDebugModal: React.FC<BreakAndDebugModalProps> = ({
  initialTopic,
  isOpen,
  onClose,
}) => {
  const [selectedWeekId, setSelectedWeekId] = useState<number>(
    initialTopic ? initialTopic.id : 1
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentTopic =
    ROADMAP_WEEKS.find((w) => w.id === selectedWeekId) ||
    initialTopic ||
    ROADMAP_WEEKS[0];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-[0_24px_50px_rgba(5,0,56,0.2)] border border-[#e0e2e8] flex flex-col">
        {/* Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-rose-50 via-red-50 to-amber-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-200/70 px-2 py-0.5 rounded-full">
                  Phương pháp cốt lõi
                </span>
                <span className="text-xs text-[#555a6a]">
                  Đọc → Làm → <strong>Cố tình làm hỏng</strong> → Debug
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1c1c1e] tracking-tight">
                Lab: Cố tình làm hỏng & Debug thực chiến
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#555a6a] hover:text-[#1c1c1e] flex items-center justify-center transition-all shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Week Selector Tabs */}
        <div className="px-5 py-2.5 bg-[#f7f8fa] border-b border-[#e0e2e8] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {ROADMAP_WEEKS.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWeekId(w.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedWeekId === w.id
                  ? "bg-[#1c1c1e] text-white shadow-sm"
                  : "bg-white border border-[#e0e2e8] text-[#555a6a] hover:border-[#1c1c1e]"
              }`}
            >
              <span>T{w.weekNumber}:</span>
              <span className="max-w-[120px] truncate">{w.title.split(":")[0]}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Week Info Banner */}
          <div className="flex items-center justify-between pb-4 border-b border-[#f0f2f5]">
            <div>
              <span className="text-xs font-bold text-rose-600">
                Tuần {currentTopic.weekNumber} · {currentTopic.phaseName}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-[#1c1c1e]">
                {currentTopic.breakAndDebug.title}
              </h3>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#fff4c4] text-[#746019] border border-[#fcb900]">
              Mục tiêu: Hiểu sâu khi phỏng vấn
            </span>
          </div>

          {/* Scenario */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
              <Bug className="w-4 h-4 text-amber-700" /> Bối cảnh Sự cố (Production Scenario)
            </h4>
            <p className="text-sm text-[#2c2c34] leading-relaxed">
              {currentTopic.breakAndDebug.scenario}
            </p>
          </div>

          {/* How to Break */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-700" /> Bước 1: Cách cố tình làm hỏng (Trigger Failure)
            </h4>
            <p className="text-sm text-[#2c2c34] leading-relaxed font-mono bg-white p-3 rounded-xl border border-rose-100 text-rose-950">
              {currentTopic.breakAndDebug.howToBreak}
            </p>
          </div>

          {/* How to Debug */}
          <div className="p-4 rounded-2xl bg-[#f7f8fa] border border-[#e0e2e8]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1c1e] mb-3 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-[#4262ff]" /> Bước 2: Các bước Debug & Lệnh truy tìm nguyên nhân
            </h4>
            <div className="space-y-2.5">
              {currentTopic.breakAndDebug.howToDebug.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-[#e0e2e8] flex items-start justify-between gap-3 group hover:border-[#1c1c1e] transition-all"
                >
                  <span className="text-xs font-mono text-[#1c1c1e] leading-relaxed flex-1">
                    {step}
                  </span>
                  <button
                    onClick={() => handleCopy(step, idx)}
                    className="p-1.5 rounded-lg bg-[#f7f8fa] hover:bg-[#eef0f3] text-[#555a6a] hover:text-[#1c1c1e] transition-all"
                    title="Sao chép câu lệnh"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-[#00b473]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Root Cause & Deep Explanation */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-700" /> Bước 3: Bản chất nguyên nhân vì sao (Hiểu sâu)
            </h4>
            <p className="text-sm text-[#1a237e] leading-relaxed">
              {currentTopic.breakAndDebug.rootCauseExplained}
            </p>
          </div>

          {/* Permanent Solution */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Bước 4: Giải pháp khắc phục triệt để (Permanent Fix)
            </h4>
            <p className="text-sm text-[#064e3b] leading-relaxed">
              {currentTopic.breakAndDebug.fixSolution}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f7f8fa] border-t border-[#e0e2e8] flex items-center justify-between">
          <span className="text-xs text-[#6b6f7e]">
            Mẹo: Hãy thực hành trên chính server cá nhân hoặc dự án Spring Boot của bạn.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#1c1c1e] text-white text-xs font-semibold hover:bg-[#2c2c34] transition-all"
          >
            Đã hiểu bài học
          </button>
        </div>
      </div>
    </div>
  );
};
