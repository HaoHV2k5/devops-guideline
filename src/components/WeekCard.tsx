"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  AlertTriangle,
  HelpCircle,
  Terminal,
  Copy,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Sparkles,
  Bug,
  Search,
} from "lucide-react";
import { WeekTopic } from "@/data/roadmapData";

interface WeekCardProps {
  topic: WeekTopic;
  isCompleted: boolean;
  onToggleComplete: (id: number) => void;
}

export const WeekCard: React.FC<WeekCardProps> = ({
  topic,
  isCompleted,
  onToggleComplete,
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"none" | "debug" | "interview">("none");

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#ffd02f", "#00b473", "#4262ff"],
      });
    }
    onToggleComplete(topic.id);
  };

  return (
    <article
      id={`week-${topic.weekNumber}`}
      className={`scroll-mt-24 rounded-2xl border transition-all duration-200 bg-white shadow-xs ${
        isCompleted
          ? "border-emerald-300 ring-1 ring-emerald-200/50"
          : "border-[#e2e4e9] hover:border-[#cbd0db] hover:shadow-sm"
      }`}
    >
      {/* Card Header */}
      <div className="p-5 md:p-6 border-b border-[#f0f2f5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md tracking-wider ${
                isCompleted
                  ? "bg-emerald-600 text-white"
                  : "bg-[#1c1c1e] text-white"
              }`}
            >
              TUẦN {topic.weekNumber}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f4f5f7] text-[#555a6a] border border-[#e5e7eb]">
              {topic.phaseName}
            </span>
            <span className="text-xs text-[#6b6f7e] flex items-center gap-1 font-medium ml-auto sm:ml-0">
              <Clock className="w-3.5 h-3.5" /> {topic.duration}
            </span>
          </div>

          {/* Complete Toggle Button */}
          <button
            onClick={handleComplete}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                : "bg-white text-[#555a6a] border border-[#d1d5db] hover:border-[#1c1c1e] hover:text-[#1c1c1e]"
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>Đã hoàn thành</span>
              </>
            ) : (
              <>
                <div className="w-3.5 h-3.5 rounded border border-[#9ca3af]" />
                <span>Đánh dấu xong</span>
              </>
            )}
          </button>
        </div>

        {/* Title & Tagline */}
        <h2 className="text-xl md:text-2xl font-bold text-[#1c1c1e] mt-3 tracking-tight">
          {topic.title}
        </h2>
        <p className="text-sm text-[#555a6a] mt-1 leading-relaxed">
          {topic.tagline}
        </p>

        {/* Java Backend Spotlight Banner */}
        <div className="mt-3.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
          <Coffee className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-[#374151] leading-relaxed">
            <strong className="text-amber-900 font-semibold">Góc nhìn Java Backend: </strong>
            {topic.javaSpecificFocus}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 md:p-6 space-y-6">
        {/* Core Learning Topics */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b6f7e] mb-3">
            Nội dung bài học & Mục tiêu cốt lõi
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {topic.coreConcepts.map((concept, idx) => (
              <li
                key={idx}
                className="text-xs md:text-sm text-[#2c2c34] bg-[#f9fafb] p-3 rounded-xl border border-[#edf0f2] flex items-start gap-2.5 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1c1c1e] shrink-0 mt-2" />
                <span>{concept}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Commands / Cheat Sheet Box (Directly visible) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1c1e] flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#4262ff]" />
              Các câu lệnh thực hành tuần {topic.weekNumber}
            </h3>
            <span className="text-[11px] text-[#6b6f7e]">Click Copy để chạy trên server/terminal</span>
          </div>

          <div className="bg-[#18181b] rounded-xl p-3 md:p-4 text-white font-mono text-xs space-y-2 border border-[#27272a]">
            {topic.cheatSheet.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-[#27272a]/60 hover:bg-[#27272a] transition-all group"
              >
                <div className="flex-1 space-y-0.5 overflow-hidden">
                  <div className="text-[#34d399] font-medium break-all select-all flex items-center gap-1.5">
                    <span className="text-[#71717a] select-none">$</span>
                    <span>{item.command}</span>
                  </div>
                  <div className="text-[11px] text-[#a1a1aa] font-sans">
                    {item.description}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(item.command)}
                  className="self-end sm:self-center inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#3f3f46] hover:bg-[#52525b] text-white text-[11px] font-sans font-medium transition-all shrink-0"
                >
                  {copiedCmd === item.command ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#a1a1aa]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Tabs for Deep Learning */}
        <div className="pt-2 border-t border-[#f0f2f5] space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab(activeTab === "debug" ? "none" : "debug")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "debug"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Cố tình làm hỏng & Debug</span>
              {activeTab === "debug" ? (
                <ChevronUp className="w-3.5 h-3.5 ml-1" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab(activeTab === "interview" ? "none" : "interview")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "interview"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Câu hỏi Phỏng vấn "Tại sao?" ({topic.whyQuestions.length})</span>
              {activeTab === "interview" ? (
                <ChevronUp className="w-3.5 h-3.5 ml-1" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              )}
            </button>
          </div>

          {/* Tab Content: Break & Debug */}
          {activeTab === "debug" && (
            <div className="p-4 md:p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-rose-200">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                    Kịch bản sự cố thực chiến
                  </span>
                  <h4 className="text-base font-bold text-[#1c1c1e]">
                    {topic.breakAndDebug.title}
                  </h4>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1">
                  <Bug className="w-3.5 h-3.5 text-rose-600" /> Bối cảnh lỗi:
                </span>
                <p className="text-xs md:text-sm text-[#374151] leading-relaxed">
                  {topic.breakAndDebug.scenario}
                </p>
              </div>

              <div className="space-y-1 bg-white p-3 rounded-xl border border-rose-100">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  1. Cách cố tình làm hỏng:
                </span>
                <p className="text-xs font-mono text-rose-950">
                  {topic.breakAndDebug.howToBreak}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#1c1c1e] uppercase tracking-wider">
                  2. Lệnh debug & Điều tra:
                </span>
                <div className="space-y-1.5">
                  {topic.breakAndDebug.howToDebug.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 rounded-lg bg-white border border-[#e5e7eb] text-xs font-mono text-[#1f2937] leading-relaxed flex items-start justify-between gap-2"
                    >
                      <span className="flex-1">{step}</span>
                      <button
                        onClick={() => handleCopy(step)}
                        className="text-[11px] font-sans font-medium text-blue-600 hover:underline shrink-0"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-blue-100 space-y-1">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  3. Vì sao lại xảy ra như vậy (Root Cause):
                </span>
                <p className="text-xs md:text-sm text-blue-950 leading-relaxed">
                  {topic.breakAndDebug.rootCauseExplained}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  4. Giải pháp khắc phục triệt để:
                </span>
                <p className="text-xs md:text-sm text-emerald-950 leading-relaxed">
                  {topic.breakAndDebug.fixSolution}
                </p>
              </div>
            </div>
          )}

          {/* Tab Content: Interview Why Questions */}
          {activeTab === "interview" && (
            <div className="p-4 md:p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4 animate-in fade-in duration-200">
              <div className="text-xs text-amber-900 font-medium">
                💡 <strong>Mẹo phỏng vấn:</strong> Hãy tự nói to câu trả lời thành lời trước khi đọc phần giải thích chi tiết bên dưới.
              </div>

              <div className="space-y-4">
                {topic.whyQuestions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 bg-white rounded-xl border border-amber-200 space-y-2.5 shadow-2xs"
                  >
                    <div className="text-sm font-bold text-[#1c1c1e] flex items-start gap-2">
                      <span className="text-amber-600 font-mono">Q{qIdx + 1}:</span>
                      <span>{q.question}</span>
                    </div>

                    <div className="text-xs md:text-sm text-[#374151] leading-relaxed bg-[#f9fafb] p-3 rounded-lg border border-[#e5e7eb]">
                      <strong className="text-[#1c1c1e] block mb-1">Giải thích trọng tâm:</strong>
                      {q.answer}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-[#6b6f7e]">Từ khóa:</span>
                      {q.keyPoints.map((point, pIdx) => (
                        <span
                          key={pIdx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-100 text-amber-800"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Skills Tags & Reference Labs */}
        <div className="pt-3 border-t border-[#f0f2f5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6b6f7e]">
          <div className="flex flex-wrap gap-1.5">
            {topic.skills.map((skill, sIdx) => (
              <span
                key={sIdx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#f4f5f7] text-[#4b5563]"
              >
                #{skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {topic.labAndDocs.map((res, rIdx) => (
              <a
                key={rIdx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[#4262ff] hover:underline"
              >
                <span>{res.name}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
