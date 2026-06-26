"use client";

import { cn } from "@/lib/utils";

const eventTypes = [
  { value: "wedding", label: "Wedding", emoji: "💍" },
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "gathering", label: "Gathering", emoji: "🎉" },
  { value: "custom", label: "Custom", emoji: "✨" },
] as const;

interface EventTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function EventTypeSelector({ value, onChange }: EventTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {eventTypes.map((type) => (
        <button
          key={type.value}
          type="button"
          onClick={() => onChange(type.value)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
            value === type.value
              ? "border-gray-900 bg-gray-50 shadow-sm"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <span className="text-2xl">{type.emoji}</span>
          <span className="text-sm font-medium">{type.label}</span>
        </button>
      ))}
    </div>
  );
}
