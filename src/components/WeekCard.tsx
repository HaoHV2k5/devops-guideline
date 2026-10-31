"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Check,
  Clock,
  Coffee,
  AlertTriangle,
  HelpCircle,
  Terminal,
  Copy,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Bug,
  Sparkles,
} from "lucide-react";
import { WeekTopic } from "@/data/roadmapData";

interface WeekCardProps {
  topic: WeekTopic;
  isCompleted: boolean;
  onToggleComplete: (id: number) => void;
  checkedConcepts: Record<string, boolean>;
  onToggleConcept: (key: string, topicId: number) => void;
}

export const WeekCard: React.FC<WeekCardProps> = ({
  topic,
  isCompleted,
  onToggleComplete,
  checkedConcepts,
  onToggleConcept,
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
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#ffd02f", "#00b473", "#4262ff"],
      });
    }
    onToggleComplete(topic.id);
  };

  // Count completed concepts
  const completedConceptsCount = topic.coreConcepts.filter(
    (_, idx) => checkedConcepts[`${topic.id}-${idx}`]
  ).length;
  const totalConcepts = topic.coreConcepts.length;
  const isAllConceptsChecked = completedConceptsCount === totalConcepts;

  const handleConceptClick = (idx: number) => {
    const key = `${topic.id}-${idx}`;
    const willBeChecked = !checkedConcepts[key];
    onToggleConcept(key, topic.id);

    if (willBeChecked && completedConceptsCount + 1 === totalConcepts && !isCompleted) {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 },
        colors: ["#00b473", "#ffd02f"],
      });
    }
  };

  return (
    <article
      id={`week-${topic.weekNumber}`}
      className={`scroll-mt-24 rounded-2xl border transition-all duration-200 bg-white opacity-100 ${
        isCompleted
          ? "border-emerald-400 ring-2 ring-emerald-100 shadow-sm"
          : "border-slate-200 hover:border-slate-300 shadow-xs"
      }`}
    >
      {/* Card Header */}
      <div className="p-5 md:p-6 border-b border-slate-100 bg-white rounded-t-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`font-mono text-xs font-bold px-3 py-1 rounded-md tracking-wider ${
                isCompleted
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 text-white"
              }`}
            >
              TUẦN {topic.weekNumber}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {topic.phaseName}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium ml-auto sm:ml-0">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {topic.duration}
            </span>
          </div>

          {/* Complete Toggle Button */}
          <button
            onClick={handleComplete}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                : "bg-white text-slate-600 border border-slate-300 hover:border-slate-900 hover:text-slate-900"
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>Đã hoàn thành</span>
              </>
            ) : (
              <>
                <div className="w-3.5 h-3.5 rounded border border-slate-400" />
                <span>Đánh dấu xong</span>
              </>
            )}
          </button>
        </div>

        {/* Title & Tagline */}
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-3 tracking-tight">
          {topic.title}
        </h2>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          {topic.tagline}
        </p>

        {/* Java Backend Spotlight Banner */}
        <div className="mt-3.5 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start gap-2.5">
          <Coffee className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-slate-800 leading-relaxed">
            <strong className="text-amber-950 font-bold">Góc nhìn Java Backend: </strong>
            {topic.javaSpecificFocus}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 md:p-6 space-y-6 bg-white">
        {/* Core Learning Topics (Interactive Checklist with Detailed Descriptions) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>Checklist kiến thức & Mục tiêu cốt lõi</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {completedConceptsCount}/{totalConcepts} mục đã nắm vững
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {topic.coreConcepts.map((concept, idx) => {
              const conceptKey = `${topic.id}-${idx}`;
              const isChecked = !!checkedConcepts[conceptKey];

              return (
                <div
                  key={idx}
                  onClick={() => handleConceptClick(idx)}
                  className={`p-3.5 md:p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 group ${
                    isChecked
                      ? "bg-emerald-50/40 border-emerald-300 text-slate-700 shadow-2xs"
                      : "bg-slate-50/80 border-slate-200 hover:border-slate-400 hover:bg-slate-100/70 text-slate-900"
                  }`}
                >
                  {/* Checkbox Icon */}
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 bg-white group-hover:border-slate-500"
                      }`}
                    >
                      {isChecked ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : null}
                    </div>
                  </div>

                  {/* Concept Title & Detailed Description */}
                  <div className="flex-1 space-y-1">
                    <h4
                      className={`text-sm font-bold leading-snug ${
                        isChecked
                          ? "line-through text-slate-500 decoration-slate-400"
                          : "text-slate-900 group-hover:text-blue-600 transition-colors"
                      }`}
                    >
                      {concept.title}
                    </h4>
                    <p
                      className={`text-xs md:text-sm leading-relaxed ${
                        isChecked
                          ? "text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      {concept.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commands / Cheat Sheet Box (High contrast terminal) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-blue-600" />
              Các câu lệnh thực hành tuần {topic.weekNumber}
            </h3>
            <span className="text-[11px] text-slate-500">Click Copy để chạy trên server/terminal</span>
          </div>

          <div className="bg-[#0f172a] rounded-xl p-3 md:p-4 text-white font-mono text-xs space-y-2.5 border border-slate-800 shadow-xs">
            {topic.cheatSheet.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-[#1e293b]/70 hover:bg-[#1e293b] transition-all border border-slate-800/80"
              >
                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="text-emerald-400 font-semibold break-all select-all flex items-center gap-1.5">
                    <span className="text-slate-500 select-none">$</span>
                    <span>{item.command}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans">
                    {item.description}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(item.command)}
                  className="self-end sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-sans font-medium transition-all shrink-0 border border-slate-700 active:scale-95"
                >
                  {copiedCmd === item.command ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Tabs for Deep Learning */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
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
                  ? "bg-amber-600 text-white shadow-xs"
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
            <div className="p-4 md:p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-rose-200">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                    Kịch bản sự cố thực chiến
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {topic.breakAndDebug.title}
                  </h4>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1">
                  <Bug className="w-3.5 h-3.5 text-rose-600" /> Bối cảnh lỗi:
                </span>
                <p className="text-xs md:text-sm text-slate-800 leading-relaxed">
                  {topic.breakAndDebug.scenario}
                </p>
              </div>

              <div className="space-y-1 bg-white p-3.5 rounded-xl border border-rose-200">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  1. Cách cố tình làm hỏng:
                </span>
                <p className="text-xs font-mono text-rose-950 font-medium">
                  {topic.breakAndDebug.howToBreak}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Lệnh debug & Điều tra:
                </span>
                <div className="space-y-1.5">
                  {topic.breakAndDebug.howToDebug.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-900 leading-relaxed flex items-start justify-between gap-2"
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

              <div className="p-3.5 bg-white rounded-xl border border-blue-200 space-y-1">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  3. Vì sao lại xảy ra như vậy (Root Cause):
                </span>
                <p className="text-xs md:text-sm text-slate-800 leading-relaxed">
                  {topic.breakAndDebug.rootCauseExplained}
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  4. Giải pháp khắc phục triệt để:
                </span>
                <p className="text-xs md:text-sm text-emerald-950 leading-relaxed font-medium">
                  {topic.breakAndDebug.fixSolution}
                </p>
              </div>
            </div>
          )}

          {/* Tab Content: Interview Why Questions */}
          {activeTab === "interview" && (
            <div className="p-4 md:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4 animate-in fade-in duration-150">
              <div className="text-xs text-amber-950 font-medium">
                💡 <strong>Mẹo phỏng vấn:</strong> Hãy tự nói to câu trả lời thành lời trước khi đọc phần giải thích chi tiết bên dưới.
              </div>

              <div className="space-y-4">
                {topic.whyQuestions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 bg-white rounded-xl border border-amber-200 space-y-2.5 shadow-xs"
                  >
                    <div className="text-sm font-bold text-slate-900 flex items-start gap-2">
                      <span className="text-amber-600 font-mono">Q{qIdx + 1}:</span>
                      <span>{q.question}</span>
                    </div>

                    <div className="text-xs md:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Giải thích trọng tâm:</strong>
                      {q.answer}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-slate-500">Từ khóa:</span>
                      {q.keyPoints.map((point, pIdx) => (
                        <span
                          key={pIdx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-100 text-amber-900"
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
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap gap-1.5">
            {topic.skills.map((skill, sIdx) => (
              <span
                key={sIdx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
              >
                #{skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {topic.labAndDocs.map((res, rIdx) => (
              <a
                key={rIdx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 hover:underline"
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
