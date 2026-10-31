"use client";

import React from "react";
import {
  X,
  BookOpen,
  ExternalLink,
  Laptop,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { RESOURCE_GUIDES } from "@/data/roadmapData";

interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResourcesModal: React.FC<ResourcesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-[0_24px_50px_rgba(5,0,56,0.2)] border border-[#e0e2e8] flex flex-col">
        {/* Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-blue-50 via-teal-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#4262ff] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                  Tài nguyên chọn lọc
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1c1c1e] tracking-tight">
                Gợi ý Tài liệu & Labs thực hành Miễn phí
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

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {RESOURCE_GUIDES.map((section, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0f2f5]">
                {sIdx === 0 ? (
                  <GraduationCap className="w-5 h-5 text-[#4262ff]" />
                ) : (
                  <Laptop className="w-5 h-5 text-[#0fbcb0]" />
                )}
                <h3 className="font-bold text-base text-[#1c1c1e]">
                  {section.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.items.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-[#f7f8fa] hover:bg-white border border-[#e0e2e8] hover:border-[#1c1c1e] hover:shadow-[0_8px_20px_rgba(5,0,56,0.06)] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="font-bold text-sm text-[#1c1c1e] group-hover:text-[#4262ff] transition-colors flex items-center gap-1">
                          {item.name}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[#8e91a0] group-hover:text-[#1c1c1e] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>

                      {"author" in item && (
                        <p className="text-xs font-medium text-[#6b6f7e] mb-1.5">
                          Tác giả: {item.author}
                        </p>
                      )}

                      <p className="text-xs text-[#555a6a] leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#eef0f3] flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#e0e2e8] text-[#555a6a]">
                        {item.badge}
                      </span>
                      <span className="text-xs font-semibold text-[#4262ff] group-hover:underline flex items-center gap-1">
                        Mở liên kết
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f7f8fa] border-t border-[#e0e2e8] flex items-center justify-between text-xs text-[#6b6f7e]">
          <span>Gợi ý: Dùng Killercoda để thực hành Kubernetes mà không cần cài đặt máy ảo.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#1c1c1e] text-white text-xs font-semibold hover:bg-[#2c2c34] transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
