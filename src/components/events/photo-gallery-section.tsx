"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";

interface Photo {
  id: string;
  thumbnailUrl: string | null;
  uploaderRole: string;
  createdAt: string;
}

interface PhotoGallerySectionProps {
  slug: string;
}

const FREE_DOWNLOADS = 20;
const UNLOCK_PRICE_SGD = 5.99;
const UNLOCK_PRICE_IDR = 49000;

function getDownloadCount(slug: string): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(`surat-downloads-${slug}`) || "0", 10);
}

function incrementDownloadCount(slug: string): number {
  const count = getDownloadCount(slug) + 1;
  localStorage.setItem(`surat-downloads-${slug}`, count.toString());
  return count;
}

function isUnlocked(slug: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`surat-unlocked-${slug}`) === "true";
}

function setUnlocked(slug: string) {
  localStorage.setItem(`surat-unlocked-${slug}`, "true");
}

export function PhotoGallerySection({ slug }: PhotoGallerySectionProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadCount, setDownloadCount] = useState(0);
  const [unlocked, setUnlockedState] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallEmail, setPaywallEmail] = useState("");
  const [paywallLoading, setPaywallLoading] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);

  useEffect(() => {
    setDownloadCount(getDownloadCount(slug));
    setUnlockedState(isUnlocked(slug));
    fetchPhotos();
  }, [slug]);

  async function fetchPhotos() {
    try {
      const res = await fetch(`/api/events/${slug}/photos`);
      const json = await res.json();
      if (res.ok && json.data) {
        setPhotos(json.data);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadClick = useCallback(
    (photoId: string) => {
      if (unlocked) return; // No limit if unlocked

      const count = getDownloadCount(slug);
      if (count >= FREE_DOWNLOADS) {
        setShowPaywall(true);
        return;
      }

      const newCount = incrementDownloadCount(slug);
      setDownloadCount(newCount);
    },
    [slug, unlocked]
  );

  const handleUnlock = async () => {
    setPaywallLoading(true);

    try {
      const res = await fetch(`/api/events/${slug}/photos/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestEmail: paywallEmail,
          amount: UNLOCK_PRICE_SGD,
          currency: "SGD",
        }),
      });

      const json = await res.json();

      if (res.ok && json.data?.unlocked) {
        setUnlocked(slug);
        setUnlockedState(true);
        setShowPaywall(false);
      } else {
        alert(json.error?.message || "Payment failed");
      }
    } catch {
      alert("Payment failed. Please try again.");
    } finally {
      setPaywallLoading(false);
    }
  };

  const handleZipDownload = async () => {
    if (!paywallEmail && !unlocked) return;
    setZipLoading(true);

    try {
      const email = paywallEmail || localStorage.getItem(`surat-email-${slug}`) || "";
      const res = await fetch(`/api/events/${slug}/photos/download?email=${encodeURIComponent(email)}`);
      const json = await res.json();

      if (!res.ok || !json.data) {
        alert("Failed to get download links");
        return;
      }

      const { default: JSZip } = await import("jszip");
      const { saveAs } = await import("file-saver");

      const zip = new JSZip();

      for (let i = 0; i < json.data.photos.length; i++) {
        const photo = json.data.photos[i];
        try {
          const imgRes = await fetch(photo.signedUrl);
          const blob = await imgRes.blob();
          zip.file(`photo-${i + 1}.jpg`, blob);
        } catch {
          // Skip failed downloads
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${slug}-photos.zip`);
    } catch {
      alert("Failed to generate ZIP. Please try again.");
    } finally {
      setZipLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">Loading photos...</CardContent>
      </Card>
    );
  }

  if (photos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📸</span> Photo Gallery
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No photos yet. Be the first to share!</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.open(`/${slug}/upload`, "_blank")}
          >
            📷 Upload Photos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>📸</span> Photo Gallery ({photos.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/${slug}/upload`, "_blank")}
          >
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Download counter */}
        {!unlocked && (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <span className="text-sm text-gray-600">
              {downloadCount} of {FREE_DOWNLOADS} free downloads used
            </span>
            {downloadCount >= FREE_DOWNLOADS && (
              <Button size="sm" onClick={() => setShowPaywall(true)}>
                Unlock All
              </Button>
            )}
          </div>
        )}

        {unlocked && (
          <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
            <span className="text-sm text-green-700 font-medium">✅ Full gallery unlocked</span>
            <Button size="sm" variant="outline" onClick={handleZipDownload} disabled={zipLoading}>
              {zipLoading ? "Generating..." : "📥 Download All (ZIP)"}
            </Button>
          </div>
        )}

        {/* Photo Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
              onClick={() => handleDownloadClick(photo.id)}
            >
              {photo.thumbnailUrl && (
                <img
                  src={photo.thumbnailUrl}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              )}
              <div className="absolute top-1 right-1">
                <Badge variant={photo.uploaderRole === "photographer" ? "info" : "default"} className="text-[10px] px-1.5 py-0.5">
                  {photo.uploaderRole === "photographer" ? "📷" : "👤"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Paywall Modal */}
        {showPaywall && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
              <div className="text-center">
                <span className="text-3xl">🔓</span>
                <h3 className="text-lg font-semibold mt-2">Unlock Full Gallery</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Download all {photos.length} photos in full resolution
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-gray-900">SGD {UNLOCK_PRICE_SGD}</p>
                <p className="text-xs text-gray-500">or IDR {UNLOCK_PRICE_IDR.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paywall-email">Your Email</Label>
                <Input
                  id="paywall-email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={paywallEmail}
                  onChange={(e) => setPaywallEmail(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPaywall(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={paywallLoading || !paywallEmail}
                  onClick={handleUnlock}
                >
                  {paywallLoading ? "Processing..." : "Pay & Unlock"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
