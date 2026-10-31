"use client";

import React, { useState } from "react";
import {
  X,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Volume2,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { WeekTopic, ROADMAP_WEEKS } from "@/data/roadmapData";

interface WhyInterviewModalProps {
  initialTopic: WeekTopic | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhyInterviewModal: React.FC<WhyInterviewModalProps> = ({
  initialTopic,
  isOpen,
  onClose,
}) => {
  const [selectedWeekId, setSelectedWeekId] = useState<number>(
    initialTopic ? initialTopic.id : 1
  );
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [confidentQuestions, setConfidentQuestions] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentTopic =
    ROADMAP_WEEKS.find((w) => w.id === selectedWeekId) ||
    initialTopic ||
    ROADMAP_WEEKS[0];

  const currentQuestion = currentTopic.whyQuestions[questionIndex] || currentTopic.whyQuestions[0];
  const questionKey = `${currentTopic.id}-${questionIndex}`;
  const isConfident = !!confidentQuestions[questionKey];

  const toggleConfident = () => {
    setConfidentQuestions((prev) => ({
      ...prev,
      [questionKey]: !prev[questionKey],
    }));
  };

  const handleNextQuestion = () => {
    setRevealed(false);
    if (questionIndex < currentTopic.whyQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // Move to next week
      const nextWeek = ROADMAP_WEEKS.find((w) => w.id === selectedWeekId + 1);
      if (nextWeek) {
        setSelectedWeekId(nextWeek.id);
        setQuestionIndex(0);
      }
    }
  };

  const handlePrevQuestion = () => {
    setRevealed(false);
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else {
      const prevWeek = ROADMAP_WEEKS.find((w) => w.id === selectedWeekId - 1);
      if (prevWeek) {
        setSelectedWeekId(prevWeek.id);
        setQuestionIndex(prevWeek.whyQuestions.length - 1);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-[0_24px_50px_rgba(5,0,56,0.2)] border border-[#e0e2e8] flex flex-col">
        {/* Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ffd02f] border-2 border-[#1c1c1e] text-[#1c1c1e] flex items-center justify-center shadow-md font-black text-xl">
              ?
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#746019] bg-[#fff4c4] border border-[#fcb900] px-2 py-0.5 rounded-full">
                  Flashcard Phỏng Vấn
                </span>
                <span className="text-xs text-[#555a6a] hidden sm:inline">
                  Mục tiêu: Nói thành lời không nhìn tài liệu
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1c1c1e] tracking-tight">
                Luyện câu hỏi "Tại sao?" (Kiến trúc & Cơ chế)
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

        {/* Week Selector Ribbon */}
        <div className="px-5 py-2.5 bg-[#f7f8fa] border-b border-[#e0e2e8] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {ROADMAP_WEEKS.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                setSelectedWeekId(w.id);
                setQuestionIndex(0);
                setRevealed(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedWeekId === w.id
                  ? "bg-[#1c1c1e] text-white shadow-sm"
                  : "bg-white border border-[#e0e2e8] text-[#555a6a] hover:border-[#1c1c1e]"
              }`}
            >
              Tuần {w.weekNumber}
            </button>
          ))}
        </div>

        {/* Flashcard Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Week & Index indicator */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#746019]">
                Tuần {currentTopic.weekNumber}: {currentTopic.title}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f7f8fa] border border-[#e0e2e8] text-[#555a6a]">
                Câu {questionIndex + 1} / {currentTopic.whyQuestions.length}
              </span>
            </div>

            {/* Speaking Reminder Alert */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2.5 text-xs text-amber-900">
              <Volume2 className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Quy tắc học:</strong> Hãy dừng lại 30 giây, nói to câu trả lời thành tiếng trước khi bấm nút mở lời giải bên dưới!
              </span>
            </div>

            {/* Question Card */}
            <div className="p-6 rounded-2xl bg-white border-2 border-[#1c1c1e] shadow-[4px_4px_0px_#1c1c1e]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#6b6f7e] mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#4262ff]" /> Câu hỏi Phỏng vấn
              </div>
              <p className="text-base md:text-lg font-bold text-[#1c1c1e] leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Reveal Answer Area */}
            {!revealed ? (
              <div className="text-center py-6">
                <button
                  onClick={() => setRevealed(true)}
                  className="px-6 py-3 rounded-full bg-[#ffd02f] hover:bg-[#fcb900] text-[#1c1c1e] font-bold text-sm shadow-[0_4px_14px_rgba(252,185,0,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                >
                  <Eye className="w-4 h-4" /> Hiện câu trả lời & điểm mấu chốt
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-5 rounded-2xl bg-[#f0f9ff] border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" /> Giải thích chiều sâu bản chất
                    </span>
                    <button
                      onClick={() => setRevealed(false)}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <EyeOff className="w-3.5 h-3.5" /> Thu gọn
                    </button>
                  </div>
                  <p className="text-sm text-[#0c4a6e] leading-relaxed whitespace-pre-line">
                    {currentQuestion.answer}
                  </p>
                </div>

                {/* Key Points Interviewer Looks For */}
                <div className="p-4 rounded-2xl bg-[#f7f8fa] border border-[#e0e2e8]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1c1c1e] mb-2 block">
                    Từ khóa quyết định điểm cộng phỏng vấn (Keywords):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.keyPoints.map((point, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#e0e2e8] text-[#2c2c34] flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00b473]" />
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="pt-4 border-t border-[#f0f2f5] flex items-center justify-between gap-3">
            <button
              onClick={handlePrevQuestion}
              className="px-4 py-2 rounded-xl border border-[#e0e2e8] hover:bg-[#f7f8fa] text-xs font-semibold text-[#555a6a] hover:text-[#1c1c1e] flex items-center gap-1.5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Câu trước
            </button>

            <button
              onClick={toggleConfident}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isConfident
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-white border border-[#e0e2e8] text-[#555a6a] hover:border-[#1c1c1e]"
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${isConfident ? "fill-emerald-700" : ""}`} />
              {isConfident ? "Đã trả lời tự tin ✓" : "Đánh dấu đã hiểu sâu"}
            </button>

            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 rounded-xl bg-[#1c1c1e] text-white hover:bg-[#2c2c34] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              Câu kế tiếp <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
