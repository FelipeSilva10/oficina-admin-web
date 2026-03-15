"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidePanelProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

export default function SidePanel({
  title,
  open,
  onClose,
  children,
  width = "w-80",
}: SidePanelProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "flex-none flex flex-col bg-white border-l border-gray-200 slide-in",
        width
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition p-1 rounded hover:bg-gray-100"
        >
          <X size={16} />
        </button>
      </div>

      {/* Corpo com scroll */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}
