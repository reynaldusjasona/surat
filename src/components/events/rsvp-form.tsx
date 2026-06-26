"use client";

import { useState } from "react";
import { Button, Input, Label, Textarea } from "@/components/ui";

interface RsvpFormProps {
  slug: string;
  onSuccess: (guest: { id: string; name: string }) => void;
}

export function RsvpForm({ slug, onSuccess }: RsvpFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rsvpStatus: "attending" as string,
    dietaryNotes: "",
  });
  const [plusOnes, setPlusOnes] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addPlusOne = () => {
    setPlusOnes([...plusOnes, { name: "" }]);
  };

  const removePlusOne = (index: number) => {
    setPlusOnes(plusOnes.filter((_, i) => i !== index));
  };

  const updatePlusOne = (index: number, name: string) => {
    const updated = [...plusOnes];
    updated[index] = { name };
    setPlusOnes(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/events/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          plusOnes: plusOnes.filter((p) => p.name.trim()),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit RSVP");
      }

      const guest = await response.json();
      onSuccess({ id: guest.id, name: guest.name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          required
          placeholder="Your full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Will you attend?</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "attending", label: "Yes", emoji: "✅" },
            { value: "maybe", label: "Maybe", emoji: "🤔" },
            { value: "not_attending", label: "No", emoji: "❌" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, rsvpStatus: option.value })}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                formData.rsvpStatus === option.value
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-lg block">{option.emoji}</span>
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Plus Ones</Label>
          <button
            type="button"
            onClick={addPlusOne}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            + Add guest
          </button>
        </div>
        {plusOnes.map((plusOne, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Guest name"
              value={plusOne.name}
              onChange={(e) => updatePlusOne(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removePlusOne(index)}
              className="px-3 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dietary">Dietary Notes (optional)</Label>
        <Textarea
          id="dietary"
          placeholder="Any allergies or dietary requirements?"
          value={formData.dietaryNotes}
          onChange={(e) => setFormData({ ...formData, dietaryNotes: e.target.value })}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit RSVP"}
      </Button>
    </form>
  );
}
