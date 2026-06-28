"use client";

import { useState, useEffect } from "react";
import { Button, Input, Label, Badge, Card, CardContent } from "@/components/ui";

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

interface RegistryTabProps {
  slug: string;
}

export function RegistryTab({ slug }: RegistryTabProps) {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    url: "",
    imageUrl: "",
    priority: "0",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

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

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const res = await fetch(`/api/events/${slug}/registry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          brand: formData.brand || undefined,
          price: parseFloat(formData.price),
          url: formData.url || undefined,
          imageUrl: formData.imageUrl || undefined,
          priority: parseInt(formData.priority),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to add item");
      }

      await fetchItems();
      setShowForm(false);
      setFormData({ name: "", brand: "", price: "", url: "", imageUrl: "", priority: "0" });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(itemId: string) {
    if (!confirm("Delete this item?")) return;

    try {
      // We'll use PATCH to clear (or a future DELETE route). For now registry items
      // can't be deleted via API — we just remove from UI. This is a known limitation.
      // TODO: Add DELETE /api/events/[slug]/registry/[id] route
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch {
      // Silent fail
    }
  }

  if (loading) {
    return <p className="text-center text-gray-500 py-8">Loading...</p>;
  }

  return (
    <div className="space-y-4">
      {/* Add Item Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Item"}
        </Button>
      </div>

      {/* Add Item Form */}
      {showForm && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleAddItem} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="reg-name">Item Name</Label>
                  <Input
                    id="reg-name"
                    required
                    placeholder="e.g. Dyson V15"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-brand">Brand</Label>
                  <Input
                    id="reg-brand"
                    placeholder="e.g. Dyson"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="reg-price">Price (SGD)</Label>
                  <Input
                    id="reg-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="899.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-priority">Priority (0-10)</Label>
                  <Input
                    id="reg-priority"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-url">Product Link (optional)</Label>
                <Input
                  id="reg-url"
                  type="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-image">Image URL (optional)</Label>
                <Input
                  id="reg-image"
                  type="url"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              {formError && (
                <p className="text-sm text-red-600">{formError}</p>
              )}

              <Button type="submit" size="sm" disabled={formLoading}>
                {formLoading ? "Adding..." : "Add to Registry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Item List */}
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No registry items yet. Add items for your guests to purchase.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  {item.brand && (
                    <span className="text-xs text-gray-500">({item.brand})</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-0.5">
                  SGD {Number(item.price).toLocaleString("en-SG")}
                </p>
                <div className="mt-1">
                  {item.isPurchased ? (
                    <Badge variant="default">
                      Taken{item.purchasedByName ? ` by ${item.purchasedByName}` : ""}
                    </Badge>
                  ) : (
                    <Badge variant="success">Available</Badge>
                  )}
                </div>
              </div>
              {!item.isPurchased && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  🗑
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
