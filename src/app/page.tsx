"use client";

import React, { useState, useEffect } from "react";
import {
  PHASES,
  ROADMAP_WEEKS,
  WeekTopic,
} from "@/data/roadmapData";
import { MinimalHeader } from "@/components/MinimalHeader";
import { LeftNavSidebar } from "@/components/LeftNavSidebar";
import { WeekCard } from "@/components/WeekCard";
import { CheatSheetModal } from "@/components/CheatSheetModal";
import { WhyInterviewModal } from "@/components/WhyInterviewModal";
import { ResourcesModal } from "@/components/ResourcesModal";
import {
  Coffee,
  Flame,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Check,
} from "lucide-react";

export default function Home() {
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
  const [checkedConcepts, setCheckedConcepts] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"timeline" | "cheatsheet" | "interview">("timeline");
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"focus" | "all">("focus");

  // Resources modal
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const savedWeeks = localStorage.getItem("devops_completed_weeks");
      if (savedWeeks) {
        setCompletedWeeks(JSON.parse(savedWeeks));
      }
      const savedConcepts = localStorage.getItem("devops_checked_concepts");
      if (savedConcepts) {
        setCheckedConcepts(JSON.parse(savedConcepts));
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

  const handleToggleConcept = (key: string, topicId: number) => {
    setCheckedConcepts((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("devops_checked_concepts", JSON.stringify(updated));
      } catch {}

      // Auto-complete week if all concepts checked
      const topic = ROADMAP_WEEKS.find((w) => w.id === topicId);
      if (topic) {
        const allChecked = topic.coreConcepts.every((_, idx) => updated[`${topicId}-${idx}`]);
        if (allChecked && !completedWeeks.includes(topicId)) {
          handleToggleComplete(topicId);
        }
      }

      return updated;
    });
  };

  const handleResetProgress = () => {
    if (confirm("Bạn có muốn đặt lại toàn bộ tiến độ 12 tuần và các mục checklist không?")) {
      setCompletedWeeks([]);
      setCheckedConcepts({});
      localStorage.removeItem("devops_completed_weeks");
      localStorage.removeItem("devops_checked_concepts");
    }
  };

  const handleSelectWeek = (weekNumber: number) => {
    setSelectedWeekNumber(weekNumber);
    if (viewMode === "all") {
      const el = document.getElementById(`week-${weekNumber}`);
      if (el) {
        const offsetTop = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Calculate completed concepts per week
  const completedConceptsMap: Record<number, number> = {};
  ROADMAP_WEEKS.forEach((w) => {
    completedConceptsMap[w.id] = w.coreConcepts.filter(
      (_, idx) => checkedConcepts[`${w.id}-${idx}`]
    ).length;
  });

  const filteredWeeks = selectedPhase
    ? ROADMAP_WEEKS.filter((w) => w.phaseId === selectedPhase)
    : ROADMAP_WEEKS;

  const currentTopic =
    ROADMAP_WEEKS.find((w) => w.weekNumber === selectedWeekNumber) ||
    ROADMAP_WEEKS[0];

  const currentPhase = PHASES.find((p) => p.id === currentTopic.phaseId);

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

      {/* Main Container: Two-Column Fixed Shell */}
      <div className="flex-1 flex w-full">
        {/* Nav Bên Trái: Luôn Cố Định, Không Bao Giờ Bị Mất Khi Cuộn */}
        {activeTab === "timeline" && (
          <LeftNavSidebar
            phases={PHASES}
            weeks={ROADMAP_WEEKS}
            completedWeeks={completedWeeks}
            selectedPhase={selectedPhase}
            onSelectPhase={setSelectedPhase}
            selectedWeekNumber={selectedWeekNumber}
            onSelectWeek={handleSelectWeek}
            completedConceptsMap={completedConceptsMap}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
          />
        )}

        {/* Khung Nội Dung Bên Phải */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {activeTab === "timeline" && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Mobile Quick Jump Bar */}
              <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
                <span className="text-xs font-bold text-slate-400 whitespace-nowrap mr-1">
                  Tuần:
                </span>
                {ROADMAP_WEEKS.map((w) => {
                  const isDone = completedWeeks.includes(w.id);
                  const isCurrent = selectedWeekNumber === w.weekNumber;
                  return (
                    <button
                      key={w.id}
                      onClick={() => handleSelectWeek(w.weekNumber)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 flex items-center justify-center transition-all ${
                        isCurrent
                          ? "bg-slate-900 text-white shadow-xs"
                          : isDone
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      {w.weekNumber}
                    </button>
                  );
                })}
              </div>

              {/* Focus Mode (Tập trung 1 tuần - Không bị kéo dài trang) */}
              {viewMode === "focus" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Top Breadcrumb & Phase Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-400">Lộ trình 12 Tuần</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <span
                        className="font-bold flex items-center gap-1.5"
                        style={{ color: currentPhase?.color }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: currentPhase?.color }}
                        />
                        {currentPhase?.title}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        Tuần {currentTopic.weekNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">
                        Tuần {selectedWeekNumber} / 12
                      </span>
                    </div>
                  </div>

                  {/* The Current Selected Week Card */}
                  <WeekCard
                    key={currentTopic.id}
                    topic={currentTopic}
                    isCompleted={completedWeeks.includes(currentTopic.id)}
                    onToggleComplete={handleToggleComplete}
                    checkedConcepts={checkedConcepts}
                    onToggleConcept={handleToggleConcept}
                  />

                  {/* Bottom Navigation: Tuần trước / Tuần kế tiếp */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
                    <button
                      disabled={selectedWeekNumber <= 1}
                      onClick={() => handleSelectWeek(selectedWeekNumber - 1)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedWeekNumber <= 1
                          ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-900 hover:text-slate-900 shadow-2xs"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Tuần trước ({selectedWeekNumber - 1})</span>
                    </button>

                    <button
                      onClick={() => handleToggleComplete(currentTopic.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        completedWeeks.includes(currentTopic.id)
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {completedWeeks.includes(currentTopic.id) ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          <span>Đã xong Tuần {selectedWeekNumber}</span>
                        </>
                      ) : (
                        <span>Hoàn thành Tuần {selectedWeekNumber}</span>
                      )}
                    </button>

                    <button
                      disabled={selectedWeekNumber >= 12}
                      onClick={() => handleSelectWeek(selectedWeekNumber + 1)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedWeekNumber >= 12
                          ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-900 hover:text-slate-900 shadow-2xs"
                      }`}
                    >
                      <span>Tuần kế tiếp ({selectedWeekNumber + 1})</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* All Weeks Mode */}
              {viewMode === "all" && (
                <div className="space-y-6">
                  {filteredWeeks.map((topic) => (
                    <WeekCard
                      key={topic.id}
                      topic={topic}
                      isCompleted={completedWeeks.includes(topic.id)}
                      onToggleComplete={handleToggleComplete}
                      checkedConcepts={checkedConcepts}
                      onToggleConcept={handleToggleConcept}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cheat Sheet Dedicated View */}
          {activeTab === "cheatsheet" && (
            <div className="max-w-4xl mx-auto">
              <CheatSheetModal
                isOpen={true}
                onClose={() => setActiveTab("timeline")}
              />
            </div>
          )}

          {/* Interview Q&A Dedicated View */}
          {activeTab === "interview" && (
            <div className="max-w-3xl mx-auto">
              <WhyInterviewModal
                isOpen={true}
                initialTopic={ROADMAP_WEEKS[0]}
                onClose={() => setActiveTab("timeline")}
              />
            </div>
          )}
        </main>
      </div>

      {/* Global Resources Modal */}
      <ResourcesModal
        isOpen={isResourcesOpen}
        onClose={() => setIsResourcesOpen(false)}
      />
    </div>
  );
}
