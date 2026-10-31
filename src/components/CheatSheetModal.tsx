"use client";

import React, { useState } from "react";
import {
  X,
  Terminal,
  Search,
  Copy,
  Check,
  Filter,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { CHEAT_SHEETS_BY_CATEGORY } from "@/data/roadmapData";

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const categories = ["All", ...CHEAT_SHEETS_BY_CATEGORY.map((c) => c.category)];

  const filteredCategories = CHEAT_SHEETS_BY_CATEGORY.map((cat) => {
    const matchesCategory =
      selectedCategory === "All" || selectedCategory === cat.category;
    if (!matchesCategory) return null;

    const filteredCommands = cat.commands.filter(
      (c) =>
        c.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredCommands.length === 0) return null;

    return {
      ...cat,
      commands: filteredCommands,
    };
  }).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1c1c1e] text-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.5)] border border-[#2c2c34] flex flex-col">
        {/* Terminal Header */}
        <div className="p-5 md:p-6 bg-[#252528] border-b border-[#38383f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* macOS terminal dots */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#ffd02f] font-mono">
                  bash · devops_guideline
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#ffd02f]" />
                Cheat Sheet: Các lệnh cứu mạng & Thực chiến
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#a5a8b5] hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-[#1f1f23] border-b border-[#2c2c34] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8e91a0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm lệnh (vd: jstack, docker, kubectl)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2c2c34] text-white pl-9 pr-3 py-1.5 rounded-xl text-xs border border-[#3e3e48] focus:outline-none focus:border-[#ffd02f] transition-all placeholder:text-[#6b6f7e]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[#ffd02f] text-[#1c1c1e] font-bold"
                    : "bg-[#2c2c34] text-[#a5a8b5] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Command List Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 font-mono">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-[#6b6f7e]">
              Không tìm thấy lệnh nào phù hợp với từ khóa "{searchQuery}"
            </div>
          ) : (
            filteredCategories.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#2c2c34]">
                  <Code2 className="w-4 h-4 text-[#ffd02f]" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {cat?.category}
                  </h3>
                  <span className="text-[11px] text-[#6b6f7e] font-sans">
                    ({cat?.commands.length} lệnh)
                  </span>
                </div>

                <div className="space-y-2">
                  {cat?.commands.map((cmdItem, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#25252b] border border-[#32323a] hover:border-[#ffd02f]/50 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1 flex-1 overflow-hidden">
                        <div className="text-xs text-[#00b473] font-semibold break-all selection:bg-[#00b473]/30">
                          <span className="text-[#8e91a0] select-none">$ </span>
                          {cmdItem.cmd}
                        </div>
                        <div className="text-[11px] text-[#a5a8b5] font-sans">
                          {cmdItem.desc}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(cmdItem.cmd)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1c1c1e] hover:bg-[#32323a] text-xs font-sans text-white border border-[#3e3e48] flex items-center gap-1.5 transition-all shrink-0"
                      >
                        {copiedCmd === cmdItem.cmd ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#00b473]" />
                            <span className="text-[#00b473]">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#a5a8b5]" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#252528] border-t border-[#38383f] flex items-center justify-between text-xs text-[#8e91a0] font-sans">
          <span>Click Copy và paste trực tiếp vào terminal của bạn để thực hành.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white text-[#1c1c1e] font-semibold hover:bg-[#ffd02f] transition-all"
          >
            Đóng bảng tra cứu
          </button>
        </div>
      </div>
    </div>
  );
};
