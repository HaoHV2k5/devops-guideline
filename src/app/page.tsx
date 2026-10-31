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
  Terminal,
  Check,
  Layers,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
  const [checkedConcepts, setCheckedConcepts] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"timeline" | "cheatsheet" | "interview">("timeline");
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

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

      {/* Main Container with Left Navigation Sidebar */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6">
        {activeTab === "timeline" && (
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Nav Bên Trái: Mục Các Tuần (Sticky Left Sidebar) */}
            <LeftNavSidebar
              phases={PHASES}
              weeks={ROADMAP_WEEKS}
              completedWeeks={completedWeeks}
              selectedPhase={selectedPhase}
              onSelectPhase={setSelectedPhase}
              completedConceptsMap={completedConceptsMap}
            />

            {/* Cột Nội Dung Chính Bên Phải */}
            <div className="flex-1 min-w-0 space-y-6">
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

              {/* Mobile Quick Jump Bar */}
              <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
                <span className="text-xs font-bold text-slate-400 whitespace-nowrap mr-1">
                  Nhảy tới:
                </span>
                {ROADMAP_WEEKS.map((w) => {
                  const isDone = completedWeeks.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      onClick={() => {
                        const el = document.getElementById(`week-${w.weekNumber}`);
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 flex items-center justify-center ${
                        isDone
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {w.weekNumber}
                    </button>
                  );
                })}
              </div>

              {/* All 12 Week Cards with Interactive Checklist */}
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
            </div>
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

      {/* Global Resources Modal */}
      <ResourcesModal
        isOpen={isResourcesOpen}
        onClose={() => setIsResourcesOpen(false)}
      />
    </div>
  );
}
