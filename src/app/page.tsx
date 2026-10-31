"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  PHASES,
  ROADMAP_WEEKS,
  WeekTopic,
} from "@/data/roadmapData";
import { MiroHeader } from "@/components/MiroHeader";
import { MiroToolbar } from "@/components/MiroToolbar";
import { StickyNoteCard } from "@/components/StickyNoteCard";
import { TimelineView } from "@/components/TimelineView";
import { KanbanView } from "@/components/KanbanView";
import { BreakAndDebugModal } from "@/components/BreakAndDebugModal";
import { WhyInterviewModal } from "@/components/WhyInterviewModal";
import { CheatSheetModal } from "@/components/CheatSheetModal";
import { ResourcesModal } from "@/components/ResourcesModal";
import { CollaborativeCursors } from "@/components/CollaborativeCursors";
import {
  Sparkles,
  ArrowRight,
  Flame,
  HelpCircle,
  Terminal,
  BookOpen,
  Coffee,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function Home() {
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
  const [activeView, setActiveView] = useState<"canvas" | "timeline" | "kanban" | "cheatsheet">("canvas");
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [tool, setTool] = useState<"select" | "hand">("select");
  const [zoom, setZoom] = useState<number>(1.0);
  const [showConnectors, setShowConnectors] = useState<boolean>(true);

  // Modals state
  const [isBreakDebugOpen, setIsBreakDebugOpen] = useState(false);
  const [breakDebugTopic, setBreakDebugTopic] = useState<WeekTopic | null>(null);

  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const [whyTopic, setWhyTopic] = useState<WeekTopic | null>(null);

  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const boardContentRef = useRef<HTMLDivElement>(null);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("devops_miro_completed_weeks");
      if (saved) {
        setCompletedWeeks(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  // Save progress
  const handleToggleComplete = (id: number) => {
    setCompletedWeeks((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem(
          "devops_miro_completed_weeks",
          JSON.stringify(updated)
        );
      } catch {}
      return updated;
    });
  };

  const handleResetProgress = () => {
    if (confirm("Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ 12 tuần không?")) {
      setCompletedWeeks([]);
      localStorage.removeItem("devops_miro_completed_weeks");
    }
  };

  // GSAP Animations on Mount and View Change
  useGSAP(
    () => {
      if (activeView === "canvas") {
        gsap.from(".miro-frame-box", {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        });

        gsap.from(".miro-sticky-item", {
          scale: 0.85,
          opacity: 0,
          duration: 0.5,
          stagger: 0.04,
          delay: 0.2,
          ease: "back.out(1.2)",
        });
      }
    },
    { dependencies: [activeView, selectedPhase] }
  );

  // Filter weeks
  const displayWeeks = selectedPhase
    ? ROADMAP_WEEKS.filter((w) => w.phaseId === selectedPhase)
    : ROADMAP_WEEKS;

  const displayPhases = selectedPhase
    ? PHASES.filter((p) => p.id === selectedPhase)
    : PHASES;

  const openBreakDebug = (topic?: WeekTopic) => {
    setBreakDebugTopic(topic || ROADMAP_WEEKS[0]);
    setIsBreakDebugOpen(true);
  };

  const openWhyInterview = (topic?: WeekTopic) => {
    setWhyTopic(topic || ROADMAP_WEEKS[0]);
    setIsWhyOpen(true);
  };

  const openCommands = (topic: WeekTopic) => {
    setIsCheatSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans selection:bg-[#ffd02f] selection:text-[#1c1c1e]">
      {/* Top Header */}
      <MiroHeader
        completedCount={completedWeeks.length}
        totalWeeks={ROADMAP_WEEKS.length}
        activeView={activeView}
        setActiveView={setActiveView}
        selectedPhase={selectedPhase}
        setSelectedPhase={setSelectedPhase}
        phases={PHASES}
        onOpenBreakDebug={() => openBreakDebug()}
        onOpenInterview={() => openWhyInterview()}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        onOpenResources={() => setIsResourcesOpen(true)}
      />

      {/* Main Board Container */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Floating Miro Left Toolbar */}
        <MiroToolbar
          tool={tool}
          setTool={setTool}
          showConnectors={showConnectors}
          setShowConnectors={setShowConnectors}
          zoom={zoom}
          setZoom={setZoom}
          onOpenBreakDebug={() => openBreakDebug()}
          onOpenInterview={() => openWhyInterview()}
          onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
          onResetView={() => setZoom(1.0)}
        />

        {/* View: Miro Interactive Board Canvas */}
        {activeView === "canvas" && (
          <div
            ref={canvasContainerRef}
            className={`flex-1 relative miro-canvas-grid min-h-[calc(100vh-120px)] overflow-auto p-4 md:p-8 lg:p-12 ${
              tool === "hand" ? "cursor-grab active:cursor-grabbing select-none" : "cursor-default"
            }`}
          >
            {/* Collaborative cursors floating around */}
            <CollaborativeCursors />

            {/* Scaled Board Canvas */}
            <div
              ref={boardContentRef}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                transition: "transform 0.25s ease-out",
              }}
              className="max-w-[1400px] mx-auto space-y-12 pb-24"
            >
              {/* Miro Canvas Welcome Hero Banner */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-[#e0e2e8] shadow-[0_4px_24px_rgba(5,0,56,0.04)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff4c4] border border-[#fcb900] text-xs font-bold text-[#746019]">
                    <Coffee className="w-3.5 h-3.5 text-amber-800" />
                    Dành riêng cho Java Backend Engineer
                  </div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#1c1c1e] tracking-tight">
                    Lộ trình DevOps 12 Tuần
                  </h1>
                  <p className="text-sm md:text-base text-[#555a6a] leading-relaxed">
                    12 tuần · khoảng 1,5–2 giờ/ngày · mục tiêu: từ <strong>“làm được”</strong> sang <strong>“hiểu vì sao”</strong> để tự tin phỏng vấn.
                  </p>
                </div>

                {/* 3 Core Rules Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
                  <div className="p-3 bg-[#f7f8fa] border border-[#e0e2e8] rounded-2xl flex items-start gap-2.5">
                    <Flame className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="block text-[#1c1c1e]">Cố tình làm hỏng</strong>
                      <span className="text-[#6b6f7e]">Debug tạo nên độ sâu</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#f7f8fa] border border-[#e0e2e8] rounded-2xl flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="block text-[#1c1c1e]">Trả lời "Tại sao?"</strong>
                      <span className="text-[#6b6f7e]">Nói thành lời trôi chảy</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#f7f8fa] border border-[#e0e2e8] rounded-2xl flex items-start gap-2.5">
                    <Terminal className="w-4 h-4 text-[#4262ff] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="block text-[#1c1c1e]">Server riêng & Repo</strong>
                      <span className="text-[#6b6f7e]">Thực hành dự án Spring</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Miro Phases Frames */}
              <div className="space-y-12">
                {displayPhases.map((phase) => {
                  const phaseWeeks = ROADMAP_WEEKS.filter(
                    (w) => w.phaseId === phase.id
                  );

                  return (
                    <div
                      key={phase.id}
                      className="miro-frame-box bg-white/60 backdrop-blur-xs rounded-3xl border-2 border-dashed border-[#c7cad5] p-6 md:p-8 shadow-[0_8px_30px_rgba(5,0,56,0.03)]"
                    >
                      {/* Miro Frame Label Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#e0e2e8] gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-4 h-4 rounded-full shadow-xs"
                            style={{ backgroundColor: phase.color }}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black uppercase tracking-wider text-[#6b6f7e]">
                                Phase {phase.id} · {phase.weeks}
                              </span>
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#e0e2e8] text-[#555a6a]">
                                {phase.badge}
                              </span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-[#1c1c1e] tracking-tight">
                              {phase.title}
                            </h2>
                          </div>
                        </div>

                        <p className="text-xs md:text-sm text-[#555a6a] max-w-md leading-relaxed">
                          {phase.description}
                        </p>
                      </div>

                      {/* Sticky Notes Grid inside Frame */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {phaseWeeks.map((week, idx) => (
                          <div key={week.id} className="miro-sticky-item">
                            <StickyNoteCard
                              topic={week}
                              isCompleted={completedWeeks.includes(week.id)}
                              onToggleComplete={handleToggleComplete}
                              onSelectBreakDebug={openBreakDebug}
                              onSelectWhyInterview={openWhyInterview}
                              onOpenCommands={openCommands}
                              rotation={idx % 3 === 0 ? -0.8 : idx % 3 === 1 ? 0.8 : -0.3}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* View: Timeline Journey */}
        {activeView === "timeline" && (
          <div className="flex-1 overflow-auto bg-white">
            <TimelineView
              weeks={displayWeeks}
              completedWeeks={completedWeeks}
              onToggleComplete={handleToggleComplete}
              onSelectBreakDebug={openBreakDebug}
              onSelectWhyInterview={openWhyInterview}
              onOpenCommands={openCommands}
            />
          </div>
        )}

        {/* View: Kanban Phased View */}
        {activeView === "kanban" && (
          <div className="flex-1 overflow-auto miro-canvas-grid">
            <KanbanView
              phases={displayPhases}
              weeks={displayWeeks}
              completedWeeks={completedWeeks}
              onToggleComplete={handleToggleComplete}
              onSelectBreakDebug={openBreakDebug}
              onSelectWhyInterview={openWhyInterview}
              onOpenCommands={openCommands}
            />
          </div>
        )}

        {/* View: Cheat Sheet Direct */}
        {activeView === "cheatsheet" && (
          <div className="flex-1 overflow-auto bg-[#1c1c1e] p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
              <CheatSheetModal
                isOpen={true}
                onClose={() => setActiveView("canvas")}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Quick Bar for Mobile */}
      <div className="md:hidden fixed bottom-3 left-4 right-4 z-30 bg-[#1c1c1e] text-white rounded-2xl p-2.5 flex items-center justify-around shadow-2xl border border-white/10 text-xs font-semibold">
        <button
          onClick={() => setActiveView("canvas")}
          className={`px-3 py-1.5 rounded-xl ${activeView === "canvas" ? "bg-white/20 text-[#ffd02f]" : "text-white/70"}`}
        >
          Board
        </button>
        <button
          onClick={() => setActiveView("timeline")}
          className={`px-3 py-1.5 rounded-xl ${activeView === "timeline" ? "bg-white/20 text-[#ffd02f]" : "text-white/70"}`}
        >
          Lộ trình
        </button>
        <button
          onClick={() => openBreakDebug()}
          className="px-3 py-1.5 rounded-xl text-rose-300 flex items-center gap-1"
        >
          <Flame className="w-3.5 h-3.5" /> Debug
        </button>
        <button
          onClick={() => openWhyInterview()}
          className="px-3 py-1.5 rounded-xl text-amber-300 flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5" /> Phỏng vấn
        </button>
      </div>

      {/* Modals */}
      <BreakAndDebugModal
        isOpen={isBreakDebugOpen}
        initialTopic={breakDebugTopic}
        onClose={() => setIsBreakDebugOpen(false)}
      />

      <WhyInterviewModal
        isOpen={isWhyOpen}
        initialTopic={whyTopic}
        onClose={() => setIsWhyOpen(false)}
      />

      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      <ResourcesModal
        isOpen={isResourcesOpen}
        onClose={() => setIsResourcesOpen(false)}
      />
    </div>
  );
}
