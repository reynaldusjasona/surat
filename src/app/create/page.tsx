"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { EventTypeSelector } from "@/components/events/event-type-selector";
import { CoverImageUpload } from "@/components/events/cover-image-upload";
import { FeatureToggles } from "@/components/events/feature-toggles";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    type: "wedding",
    date: "",
    location: "",
    locationUrl: "",
    description: "",
    coverImageUrl: "",
    guestCapacity: "",
    featuresEnabled: { angpao: true, registry: true, photos: true } as Record<string, boolean>,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          date: new Date(formData.date).toISOString(),
          location: formData.location,
          locationUrl: formData.locationUrl || undefined,
          description: formData.description || undefined,
          coverImageUrl: formData.coverImageUrl || undefined,
          guestCapacity: formData.guestCapacity ? parseInt(formData.guestCapacity) : undefined,
          featuresEnabled: formData.featuresEnabled,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error(data.error || "Failed to create event");
      }

      const { slug } = await response.json();
      router.push(`/dashboard/${slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
          <p className="text-gray-500 mt-1">Set up your event and share it with guests</p>
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <Label>Cover Image</Label>
          <CoverImageUpload
            value={formData.coverImageUrl}
            onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            required
            placeholder="e.g. Jason & Sarah's Wedding"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <Label>Event Type</Label>
          <EventTypeSelector
            value={formData.type}
            onChange={(type) => setFormData({ ...formData, type })}
          />
        </div>

        {/* Date & Time */}
        <div className="space-y-2">
          <Label htmlFor="date">Date & Time</Label>
          <Input
            id="date"
            type="datetime-local"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            required
            placeholder="e.g. Marina Bay Sands, Singapore"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        {/* Location URL */}
        <div className="space-y-2">
          <Label htmlFor="locationUrl">Google Maps Link (optional)</Label>
          <Input
            id="locationUrl"
            type="url"
            placeholder="https://maps.google.com/..."
            value={formData.locationUrl}
            onChange={(e) => setFormData({ ...formData, locationUrl: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Tell your guests about the event..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Guest Capacity */}
        <div className="space-y-2">
          <Label htmlFor="capacity">Guest Capacity (optional)</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            placeholder="e.g. 200"
            value={formData.guestCapacity}
            onChange={(e) => setFormData({ ...formData, guestCapacity: e.target.value })}
          />
        </div>

        {/* Feature Toggles */}
        <div className="space-y-2">
          <Label>Features</Label>
          <FeatureToggles
            value={formData.featuresEnabled}
            onChange={(features) => setFormData({ ...formData, featuresEnabled: features })}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
        )}

        {/* Submit */}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </main>
  );
}
