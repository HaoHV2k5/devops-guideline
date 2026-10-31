"use client";

import React from "react";
import {
  MousePointer2,
  Hand,
  StickyNote,
  GitCommit,
  HelpCircle,
  AlertTriangle,
  Terminal,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
} from "lucide-react";

interface MiroToolbarProps {
  tool: "select" | "hand";
  setTool: (tool: "select" | "hand") => void;
  showConnectors: boolean;
  setShowConnectors: (show: boolean) => void;
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  onOpenBreakDebug: () => void;
  onOpenInterview: () => void;
  onOpenCheatSheet: () => void;
  onResetView: () => void;
}

export const MiroToolbar: React.FC<MiroToolbarProps> = ({
  tool,
  setTool,
  showConnectors,
  setShowConnectors,
  zoom,
  setZoom,
  onOpenBreakDebug,
  onOpenInterview,
  onOpenCheatSheet,
  onResetView,
}) => {
  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-1.5 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#e0e2e8] shadow-[0_8px_30px_rgba(5,0,56,0.08)]">
      {/* Select Cursor */}
      <button
        onClick={() => setTool("select")}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          tool === "select"
            ? "bg-[#1c1c1e] text-white shadow-sm"
            : "text-[#555a6a] hover:bg-[#f7f8fa] hover:text-[#1c1c1e]"
        }`}
        title="Công cụ chọn (V)"
      >
        <MousePointer2 className="w-5 h-5" />
      </button>

      {/* Hand Pan */}
      <button
        onClick={() => setTool("hand")}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          tool === "hand"
            ? "bg-[#1c1c1e] text-white shadow-sm"
            : "text-[#555a6a] hover:bg-[#f7f8fa] hover:text-[#1c1c1e]"
        }`}
        title="Công cụ di chuyển canvas (H)"
      >
        <Hand className="w-5 h-5" />
      </button>

      <div className="w-6 h-[1px] bg-[#e0e2e8] mx-auto my-1" />

      {/* Sticky Note Indicator */}
      <button
        className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#fff4c4] text-[#746019] border border-[#fcb900]/40 hover:scale-105 active:scale-95 transition-all shadow-sm"
        title="Miro Sticky Notes (Lộ trình 12 tuần)"
      >
        <StickyNote className="w-5 h-5 fill-[#ffd02f]/40" />
      </button>

      {/* Toggle Connectors */}
      <button
        onClick={() => setShowConnectors(!showConnectors)}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          showConnectors
            ? "bg-[#4262ff] text-white shadow-sm"
            : "text-[#555a6a] hover:bg-[#f7f8fa] hover:text-[#1c1c1e]"
        }`}
        title="Bật/Tắt đường nối tiến trình (Connector Lines)"
      >
        <GitCommit className="w-5 h-5 rotate-90" />
      </button>

      <div className="w-6 h-[1px] bg-[#e0e2e8] mx-auto my-1" />

      {/* Break & Debug Scenario */}
      <button
        onClick={onOpenBreakDebug}
        className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all hover:scale-105"
        title="Lab: Cố tình làm hỏng & Debug"
      >
        <AlertTriangle className="w-5 h-5" />
      </button>

      {/* Interview Why Questions */}
      <button
        onClick={onOpenInterview}
        className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-all hover:scale-105"
        title="Luyện tập phỏng vấn câu hỏi 'Tại sao?'"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Cheat Sheet Terminal */}
      <button
        onClick={onOpenCheatSheet}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-[#555a6a] hover:bg-[#f7f8fa] hover:text-[#1c1c1e] transition-all"
        title="Bảng tra cứu lệnh CLI nhanh"
      >
        <Terminal className="w-5 h-5" />
      </button>

      <div className="w-6 h-[1px] bg-[#e0e2e8] mx-auto my-1" />

      {/* Zoom In */}
      <button
        onClick={() => setZoom((prev) => Math.min(prev + 0.1, 1.4))}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-[#555a6a] hover:bg-[#f7f8fa] hover:text-[#1c1c1e] transition-all"
        title="Phóng to"
      >
        <ZoomIn className="w-5 h-5" />
      </button>

      {/* Zoom Value / Reset */}
      <button
        onClick={onResetView}
        className="text-[11px] font-bold text-[#6b6f7e] hover:text-[#1c1c1e] text-center py-1 transition-all"
        title="Đặt lại 100%"
      >
        {Math.round(zoom * 100)}%
      </button>

      {/* Zoom Out */}
      <button
        onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.7))}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-[#555a6a] hover:bg-[#f7f8fa] hover:text-[#1c1c1e] transition-all"
        title="Thu nhỏ"
      >
        <ZoomOut className="w-5 h-5" />
      </button>

      {/* Fit to screen */}
      <button
        onClick={onResetView}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-[#555a6a] hover:bg-[#f7f8fa] hover:text-[#1c1c1e] transition-all"
        title="Toàn màn hình vừa vặn"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </aside>
  );
};
