"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardContent } from "@/components/ui";

interface PhotosTabProps {
  slug: string;
}

export function PhotosTab({ slug }: PhotosTabProps) {
  const [stats, setStats] = useState({
    totalPhotos: 0,
    photographerPhotos: 0,
    guestPhotos: 0,
    totalUnlocks: 0,
    revenue: 0,
  });
  const [uploadUrl, setUploadUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [slug]);

  async function fetchStats() {
    try {
      // Fetch photos
      const photosRes = await fetch(`/api/events/${slug}/photos`);
      const photosJson = await photosRes.json();

      if (photosRes.ok && photosJson.data) {
        const photos = photosJson.data;
        setStats({
          totalPhotos: photos.length,
          photographerPhotos: photos.filter((p: { uploaderRole: string }) => p.uploaderRole === "photographer").length,
          guestPhotos: photos.filter((p: { uploaderRole: string }) => p.uploaderRole === "guest").length,
          totalUnlocks: 0, // Would need a separate endpoint
          revenue: 0,
        });
      }

      // Get upload URL
      const baseUrl = window.location.origin;
      setUploadUrl(`${baseUrl}/${slug}/upload?role=photographer`);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className="text-center text-gray-500 py-8">Loading...</p>;
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Total Photos</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalPhotos}</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">By Photographer</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{stats.photographerPhotos}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">By Guests</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.guestPhotos}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Unlocks</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.totalUnlocks}</p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Link */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-medium text-gray-900">Photographer Upload Link</h3>
          <p className="text-sm text-gray-500">Share this link with your photographer for easy photo uploads.</p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={uploadUrl}
              className="flex-1 h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-600 truncate"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(uploadUrl);
                alert("Link copied!");
              }}
            >
              Copy
            </Button>
          </div>

          {/* QR Code placeholder — using a simple text representation */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="inline-block p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">QR Code</p>
              <p className="text-[10px] text-gray-400 max-w-[200px] break-all">{uploadUrl}</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">Show this QR code to your photographer</p>
          </div>
        </CardContent>
      </Card>

      {/* Guest Upload Link */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-medium text-gray-900">Guest Upload Link</h3>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/${slug}/upload`}
              className="flex-1 h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-600 truncate"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/${slug}/upload`);
                alert("Link copied!");
              }}
            >
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
