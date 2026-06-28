"use client";

import { useState, useEffect } from "react";
import { Button, Input, Label, Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface RegistryItem {
  id: string;
  name: string;
  brand: string | null;
  price: string;
  url: string | null;
  imageUrl: string | null;
  isPurchased: boolean;
  purchasedByName: string | null;
}

interface RegistrySectionProps {
  slug: string;
}

export function RegistrySection({ slug }: RegistrySectionProps) {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseModal, setPurchaseModal] = useState<string | null>(null);
  const [purchaseForm, setPurchaseForm] = useState({
    purchasedByName: "",
    purchasedByEmail: "",
    isAnonymousPurchase: false,
  });
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");

  useEffect(() => {
    fetchItems();
  }, [slug]);

  async function fetchItems() {
    try {
      const res = await fetch(`/api/events/${slug}/registry`);
      const json = await res.json();
      if (res.ok && json.data) {
        setItems(json.data);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(itemId: string) {
    setPurchaseLoading(true);
    setPurchaseError("");

    try {
      const res = await fetch(`/api/events/${slug}/registry/${itemId}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseForm),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to mark as purchased");
      }

      // Refresh items
      await fetchItems();
      setPurchaseModal(null);
      setPurchaseForm({ purchasedByName: "", purchasedByEmail: "", isAnonymousPurchase: false });
    } catch (err) {
      setPurchaseError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPurchaseLoading(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Loading registry...
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return null;
  }

  // Activity feed — recent purchases
  const recentPurchases = items
    .filter((item) => item.isPurchased)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🎁</span> Gift Registry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-xl p-4 space-y-3"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg bg-gray-100"
                />
              )}
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                {item.brand && (
                  <p className="text-xs text-gray-500">{item.brand}</p>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-900">
                SGD {Number(item.price).toLocaleString("en-SG")}
              </p>
              <div className="flex items-center justify-between">
                {item.isPurchased ? (
                  <Badge variant="default">
                    {item.purchasedByName
                      ? `Taken by ${item.purchasedByName}`
                      : "Taken"}
                  </Badge>
                ) : (
                  <Badge variant="success">Available</Badge>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View →
                  </a>
                )}
              </div>
              {!item.isPurchased && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setPurchaseModal(item.id)}
                >
                  I&apos;ll get this
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        {recentPurchases.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Recent Activity
            </p>
            <div className="space-y-1">
              {recentPurchases.map((item) => (
                <p key={item.id} className="text-sm text-gray-600">
                  <span className="font-medium">{item.purchasedByName || "Someone"}</span>
                  {" is getting "}
                  <span className="font-medium">{item.name}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Purchase Modal */}
        {purchaseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
              <h3 className="text-lg font-semibold">Mark as Purchased</h3>

              <div className="space-y-2">
                <Label htmlFor="purchase-name">Your Name</Label>
                <Input
                  id="purchase-name"
                  required
                  placeholder="Your name"
                  value={purchaseForm.purchasedByName}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, purchasedByName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase-email">Your Email</Label>
                <Input
                  id="purchase-email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={purchaseForm.purchasedByEmail}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, purchasedByEmail: e.target.value })}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={purchaseForm.isAnonymousPurchase}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, isAnonymousPurchase: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm text-gray-600">Keep my name anonymous</span>
              </label>

              {purchaseError && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{purchaseError}</p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setPurchaseModal(null);
                    setPurchaseError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={purchaseLoading || !purchaseForm.purchasedByName || !purchaseForm.purchasedByEmail}
                  onClick={() => handlePurchase(purchaseModal)}
                >
                  {purchaseLoading ? "Saving..." : "Confirm"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
