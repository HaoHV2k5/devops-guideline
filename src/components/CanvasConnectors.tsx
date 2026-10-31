"use client";

import React from "react";

interface CanvasConnectorsProps {
  show: boolean;
}

export const CanvasConnectors: React.FC<CanvasConnectorsProps> = ({ show }) => {
  if (!show) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="miro-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#c7cad5" />
        </marker>
      </defs>
    </svg>
  );
};
