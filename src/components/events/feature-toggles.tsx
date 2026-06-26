"use client";

interface FeatureTogglesProps {
  value: Record<string, boolean>;
  onChange: (value: Record<string, boolean>) => void;
}

const features = [
  { key: "angpao", label: "Digital Angpao", description: "Let guests send digital red packets", emoji: "🧧" },
  { key: "registry", label: "Gift Registry", description: "Share your wishlist with guests", emoji: "🎁" },
  { key: "photos", label: "Photo Sharing", description: "Guests can upload & view photos", emoji: "📸" },
];

export function FeatureToggles({ value, onChange }: FeatureTogglesProps) {
  const toggle = (key: string) => {
    onChange({ ...value, [key]: !value[key] });
  };

  return (
    <div className="space-y-3">
      {features.map((feature) => (
        <label
          key={feature.key}
          className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <span className="text-2xl">{feature.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{feature.label}</p>
            <p className="text-xs text-gray-500">{feature.description}</p>
          </div>
          <input
            type="checkbox"
            checked={value[feature.key] || false}
            onChange={() => toggle(feature.key)}
            className="h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
        </label>
      ))}
    </div>
  );
}
