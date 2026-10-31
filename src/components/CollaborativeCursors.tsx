"use client";

import React, { useEffect, useState } from "react";
import { MousePointer2 } from "lucide-react";

interface CursorData {
  id: string;
  name: string;
  role: string;
  color: string;
  x: number;
  y: number;
}

export const CollaborativeCursors: React.FC = () => {
  const [cursors, setCursors] = useState<CursorData[]>([
    {
      id: "1",
      name: "Đạt (DevOps Mentor)",
      role: "SRE Lead",
      color: "#0fbcb0",
      x: 18,
      y: 22,
    },
    {
      id: "2",
      name: "Bạn (Java Backend)",
      role: "12 Tuần DevOps",
      color: "#ffd02f",
      x: 64,
      y: 45,
    },
    {
      id: "3",
      name: "Huy (Cloud Architect)",
      role: "AWS & K8s",
      color: "#4262ff",
      x: 82,
      y: 75,
    },
  ]);

  // Subtle wandering animation for live board feel
  useEffect(() => {
    const interval = setInterval(() => {
      setCursors((prev) =>
        prev.map((c, i) => {
          if (i === 1) return c; // keep user relatively fixed
          const dx = (Math.random() - 0.5) * 4;
          const dy = (Math.random() - 0.5) * 4;
          return {
            ...c,
            x: Math.min(Math.max(c.x + dx, 5), 92),
            y: Math.min(Math.max(c.y + dy, 10), 88),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {cursors.map((cursor) => (
        <div
          key={cursor.id}
          className="absolute transition-all duration-1000 ease-out flex items-start gap-1 select-none"
          style={{
            left: `${cursor.x}%`,
            top: `${cursor.y}%`,
          }}
        >
          <MousePointer2
            className="w-4 h-4 drop-shadow-sm -rotate-45"
            style={{ color: cursor.color, fill: cursor.color }}
          />
          <div
            className="px-2 py-0.5 rounded-md text-[10px] font-bold text-[#1c1c1e] shadow-sm whitespace-nowrap flex items-center gap-1 border border-black/10"
            style={{ backgroundColor: cursor.color }}
          >
            <span>{cursor.name}</span>
            <span className="opacity-75 font-normal">({cursor.role})</span>
          </div>
        </div>
      ))}
    </div>
  );
};
