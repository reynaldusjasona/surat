"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { RsvpForm } from "@/components/events/rsvp-form";
import { AngpaoSection } from "@/components/events/angpao-section";
import { RegistrySection } from "@/components/events/registry-section";
import { PhotoGallerySection } from "@/components/events/photo-gallery-section";

interface EventData {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  locationUrl: string | null;
  description: string | null;
  coverImageUrl: string | null;
  slug: string;
  featuresEnabled: Record<string, boolean>;
  host: { name: string };
}

const typeLabels: Record<string, string> = {
  wedding: "💍 Wedding",
  birthday: "🎂 Birthday",
  gathering: "🎉 Gathering",
  custom: "✨ Event",
};

export default function EventPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvpSuccess, setRsvpSuccess] = useState<{ id: string; name: string } | null>(null);
  const [walletLoading, setWalletLoading] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [slug]);

  const handleCalendarDownload = () => {
    window.open(`/api/events/${slug}/calendar`, "_blank");
  };

  const handleWalletPass = async (passType: "apple" | "google") => {
    if (!rsvpSuccess) return;
    setWalletLoading(passType);

    try {
      const res = await fetch(`/api/events/${slug}/wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: rsvpSuccess.id, passType }),
      });

      if (passType === "apple" && res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${slug}-pass.pkpass`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (passType === "google" && res.ok) {
        const data = await res.json();
        if (data.saveUrl) {
          window.open(data.saveUrl, "_blank");
        }
      } else {
        const data = await res.json();
        alert(data.error || "Wallet pass not available. Use the calendar download instead.");
      }
    } catch {
      alert("Wallet pass generation failed. Please use the calendar download.");
    } finally {
      setWalletLoading("");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading event...</p>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Event Not Found</h1>
          <p className="text-gray-500 mt-2">{error || "This event does not exist."}</p>
        </div>
      </main>
    );
  }

  const eventDate = new Date(event.date);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative w-full aspect-[21/9] max-h-[400px] bg-gray-200">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-6 sm:p-8 w-full">
            <Badge variant="info" className="mb-2">
              {typeLabels[event.type] || event.type}
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{event.title}</h1>
            <p className="text-white/80 text-sm mt-1">Hosted by {event.host.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Event Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">📅</span>
              <div>
                <p className="font-medium text-gray-900">
                  {eventDate.toLocaleDateString("en-SG", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {eventDate.toLocaleTimeString("en-SG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-medium text-gray-900">{event.location}</p>
                {event.locationUrl && (
                  <a
                    href={event.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Open in Maps →
                  </a>
                )}
              </div>
            </div>

            {event.description && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{event.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RSVP Section */}
        {!rsvpSuccess ? (
          <Card>
            <CardHeader>
              <CardTitle>RSVP</CardTitle>
            </CardHeader>
            <CardContent>
              <RsvpForm slug={slug} onSuccess={setRsvpSuccess} />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <span className="text-4xl">🎉</span>
                <h3 className="text-lg font-semibold text-gray-900 mt-2">
                  RSVP Submitted!
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Thank you, {rsvpSuccess.name}. See you there!
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCalendarDownload}
                >
                  📅 Add to Calendar (.ics)
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleWalletPass("apple")}
                  disabled={walletLoading === "apple"}
                >
                  {walletLoading === "apple" ? "Generating..." : "🍎 Add to Apple Wallet"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleWalletPass("google")}
                  disabled={walletLoading === "google"}
                >
                  {walletLoading === "google" ? "Generating..." : "📱 Add to Google Wallet"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature Sections */}
        {event.featuresEnabled?.angpao && (
          <AngpaoSection slug={slug} eventType={event.type} />
        )}

        {event.featuresEnabled?.registry && (
          <RegistrySection slug={slug} />
        )}

        {event.featuresEnabled?.photos && (
          <PhotoGallerySection slug={slug} />
        )}
      </div>
    </main>
  );
}
