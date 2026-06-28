"use client";

import { useState } from "react";
import { Button, Input, Label, Textarea, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface AngpaoSectionProps {
  slug: string;
  eventType: string;
}

function getSuggestedAmount(eventType: string, currency: string): string | null {
  if (eventType === "wedding") {
    return currency === "SGD" ? "Suggested: SGD 100 – 200" : "Suggested: IDR 500,000 – 1,000,000";
  }
  return null;
}

export function AngpaoSection({ slug, eventType }: AngpaoSectionProps) {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    amount: "",
    currency: "SGD",
    message: "",
    isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ amount: string; currency: string; message: string | null } | null>(null);

  const suggestion = getSuggestedAmount(eventType, formData.currency);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${slug}/angpao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to send angpao");
      }

      setReceipt({
        amount: json.data.amount,
        currency: json.data.currency,
        message: json.data.message,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Receipt modal
  if (receipt) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center space-y-4">
          <span className="text-5xl">🧧</span>
          <h3 className="text-lg font-semibold text-gray-900">Angpao Sent!</h3>
          <p className="text-2xl font-bold text-red-600">
            {receipt.currency} {Number(receipt.amount).toLocaleString("en-SG")}
          </p>
          {receipt.message && (
            <p className="text-sm text-gray-600 italic">&ldquo;{receipt.message}&rdquo;</p>
          )}
          <p className="text-sm text-gray-500">Thank you for your generous gift 🙏</p>
          <Button
            variant="outline"
            onClick={() => {
              setReceipt(null);
              setFormData({ senderName: "", senderEmail: "", amount: "", currency: "SGD", message: "", isAnonymous: false });
            }}
          >
            Send Another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🧧</span> Send Digital Angpao
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="angpao-amount">Amount</Label>
              <Input
                id="angpao-amount"
                type="number"
                min="1"
                step="0.01"
                required
                placeholder="100"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="angpao-currency">Currency</Label>
              <select
                id="angpao-currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="SGD">SGD</option>
                <option value="IDR">IDR</option>
              </select>
            </div>
          </div>

          {suggestion && (
            <p className="text-xs text-gray-500">{suggestion}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="angpao-name">Your Name</Label>
            <Input
              id="angpao-name"
              required
              placeholder="Your name"
              value={formData.senderName}
              onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="angpao-email">Your Email</Label>
            <Input
              id="angpao-email"
              type="email"
              required
              placeholder="your@email.com"
              value={formData.senderEmail}
              onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="angpao-message">Message (optional)</Label>
            <Textarea
              id="angpao-message"
              placeholder="Congratulations! Wishing you a lifetime of happiness..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              maxLength={500}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <span className="text-sm text-gray-600">Send anonymously</span>
          </label>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Send Angpao 🧧"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
