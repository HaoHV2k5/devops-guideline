"use client";

import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  PHASES,
  ROADMAP_WEEKS,
  WeekTopic,
} from "@/data/roadmapData";
import { MinimalHeader } from "@/components/MinimalHeader";
import { TimelineSidebar } from "@/components/TimelineSidebar";
import { WeekCard } from "@/components/WeekCard";
import { CheatSheetModal } from "@/components/CheatSheetModal";
import { WhyInterviewModal } from "@/components/WhyInterviewModal";
import { ResourcesModal } from "@/components/ResourcesModal";
import {
  Coffee,
  Flame,
  HelpCircle,
  Terminal,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"timeline" | "cheatsheet" | "interview">("timeline");
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [activeWeekId, setActiveWeekId] = useState<number | null>(null);

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

  // GSAP animation on mount
  useGSAP(() => {
    if (activeTab === "timeline") {
      gsap.from("article", {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      });
    }
  }, { dependencies: [activeTab, selectedPhase] });

  const filteredWeeks = selectedPhase
    ? ROADMAP_WEEKS.filter((w) => w.phaseId === selectedPhase)
    : ROADMAP_WEEKS;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1c1c1e] flex flex-col font-sans">
      {/* Sleek Minimal Header */}
      <MinimalHeader
        completedCount={completedWeeks.length}
        totalWeeks={ROADMAP_WEEKS.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenResources={() => setIsResourcesOpen(true)}
        onResetProgress={handleResetProgress}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-8">
        {activeTab === "timeline" && (
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left Sticky Timeline Navigator */}
            <TimelineSidebar
              phases={PHASES}
              weeks={ROADMAP_WEEKS}
              completedWeeks={completedWeeks}
              selectedPhase={selectedPhase}
              onSelectPhase={setSelectedPhase}
              activeWeekId={activeWeekId}
            />

            {/* Right Main Content Stream */}
            <div className="flex-1 w-full space-y-8">
              {/* Introduction Box */}
              <div className="bg-white rounded-2xl p-6 border border-[#e2e4e9] shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
                      Lộ trình DevOps cho Java Backend
                    </h1>
                    <p className="text-sm text-[#4b5563] mt-0.5">
                      12 tuần · khoảng 1,5–2 giờ/ngày · mục tiêu: từ <strong>“làm được”</strong> sang <strong>“hiểu vì sao”</strong> để tự tin phỏng vấn.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {completedWeeks.length}/12 tuần hoàn thành
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#f3f4f6]">
                  <div className="text-xs text-[#4b5563] flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-600 shrink-0" />
                    <span><strong>Cố tình làm hỏng:</strong> Debug tạo nên độ sâu</span>
                  </div>
                  <div className="text-xs text-[#4b5563] flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>Hỏi "Tại sao?":</strong> Nói thành lời không nhìn tài liệu</span>
                  </div>
                  <div className="text-xs text-[#4b5563] flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-800 shrink-0" />
                    <span><strong>Thực hành:</strong> Server riêng & dự án Spring Boot</span>
                  </div>
                </div>
              </div>

              {/* Weeks List */}
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
