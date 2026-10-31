"use client";

import React, { useState, useEffect } from "react";
import {
  PHASES,
  ROADMAP_WEEKS,
  WeekTopic,
} from "@/data/roadmapData";
import { MinimalHeader } from "@/components/MinimalHeader";
import { WeekCard } from "@/components/WeekCard";
import { CheatSheetModal } from "@/components/CheatSheetModal";
import { WhyInterviewModal } from "@/components/WhyInterviewModal";
import { ResourcesModal } from "@/components/ResourcesModal";
import {
  Coffee,
  Flame,
  HelpCircle,
  Terminal,
  Check,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"timeline" | "cheatsheet" | "interview">("timeline");
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  // Resources modal
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  // Load progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem("devops_completed_weeks");
      if (saved) {
        setCompletedWeeks(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleToggleComplete = (id: number) => {
    setCompletedWeeks((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem("devops_completed_weeks", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleResetProgress = () => {
    if (confirm("Bạn có muốn đặt lại toàn bộ tiến độ 12 tuần không?")) {
      setCompletedWeeks([]);
      localStorage.removeItem("devops_completed_weeks");
    }
  };

  const scrollToWeek = (weekNumber: number) => {
    const el = document.getElementById(`week-${weekNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredWeeks = selectedPhase
    ? ROADMAP_WEEKS.filter((w) => w.phaseId === selectedPhase)
    : ROADMAP_WEEKS;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-[#ffd02f] selection:text-slate-900">
      {/* Sleek Minimal Header */}
      <MinimalHeader
        completedCount={completedWeeks.length}
        totalWeeks={ROADMAP_WEEKS.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenResources={() => setIsResourcesOpen(true)}
        onResetProgress={handleResetProgress}
      />

      {/* Sticky Horizontal Timeline & Phase Bar */}
      {activeTab === "timeline" && (
        <nav aria-label="Timeline navigation" className="sticky top-[61px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 shadow-2xs">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Phase Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1 mr-1">
                <Layers className="w-3.5 h-3.5" /> Giai đoạn:
              </span>
              <button
                onClick={() => setSelectedPhase(null)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedPhase === null
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                Tất cả (12 tuần)
              </button>
              {PHASES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPhase(selectedPhase === p.id ? null : p.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedPhase === p.id
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span>P{p.id}: {p.weeks}</span>
                </button>
              ))}
            </div>

            {/* Quick-Jump Week Stepper (1 to 12) */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 whitespace-nowrap">
                Đến tuần:
              </span>
              {ROADMAP_WEEKS.map((w) => {
                const isDone = completedWeeks.includes(w.id);
                return (
                  <button
                    key={w.id}
                    onClick={() => scrollToWeek(w.weekNumber)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all shrink-0 ${
                      isDone
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white"
                    }`}
                    title={`Tuần ${w.weekNumber}: ${w.title} (${isDone ? "Đã xong" : "Chưa xong"})`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : w.weekNumber}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {activeTab === "timeline" && (
          <div className="space-y-6">
            {/* Minimal Welcome Hero */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Lộ trình DevOps cho Java Backend
                  </h1>
                  <p className="text-sm text-slate-600 mt-0.5">
                    12 tuần · khoảng 1,5–2 giờ/ngày · mục tiêu: từ <strong>“làm được”</strong> sang <strong>“hiểu vì sao”</strong> để tự tin phỏng vấn.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {completedWeeks.length}/12 tuần hoàn thành
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600 shrink-0" />
                  <span><strong>Cố tình làm hỏng:</strong> Hiểu sâu nằm ở debug</span>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Hỏi "Tại sao?":</strong> Nói thành lời không nhìn tài liệu</span>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-800 shrink-0" />
                  <span><strong>Thực hành:</strong> Server riêng & Spring Boot</span>
                </div>
              </div>
            </div>

            {/* All 12 Week Cards */}
            <div className="space-y-6">
              {filteredWeeks.map((topic) => (
                <WeekCard
                  key={topic.id}
                  topic={topic}
                  isCompleted={completedWeeks.includes(topic.id)}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Cheat Sheet Dedicated View */}
        {activeTab === "cheatsheet" && (
          <div className="w-full">
            <CheatSheetModal
              isOpen={true}
              onClose={() => setActiveTab("timeline")}
            />
          </div>
        )}

        {/* Interview Q&A Dedicated View */}
        {activeTab === "interview" && (
          <div className="w-full">
            <WhyInterviewModal
              isOpen={true}
              initialTopic={ROADMAP_WEEKS[0]}
              onClose={() => setActiveTab("timeline")}
            />
          </div>
        )}
      </main>

      {/* Global Resources Modal */}
      <ResourcesModal
        isOpen={isResourcesOpen}
        onClose={() => setIsResourcesOpen(false)}
      />
    </div>
  );
}
