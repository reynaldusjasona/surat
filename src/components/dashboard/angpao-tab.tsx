"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardContent, Badge } from "@/components/ui";

interface AngpaoItem {
  id: string;
  senderName: string;
  amount: string;
  currency: string;
  message: string | null;
  isAnonymous: boolean;
  isThanked: boolean;
  createdAt: string;
}

interface AngpaoTabProps {
  slug: string;
}

export function AngpaoTab({ slug }: AngpaoTabProps) {
  const [angpaoList, setAngpaoList] = useState<AngpaoItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAngpao();
  }, [slug]);

  async function fetchAngpao() {
    try {
      const res = await fetch(`/api/events/${slug}/angpao`);
      const json = await res.json();
      if (res.ok && json.data) {
        setAngpaoList(json.data.angpao);
        setTotalAmount(json.data.totalAmount);
        setCount(json.data.count);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }

  async function handleThank(id: string) {
    try {
      const res = await fetch(`/api/events/${slug}/angpao/${id}/thank`, {
        method: "PATCH",
      });
      if (res.ok) {
        setAngpaoList((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isThanked: true } : a))
        );
      }
    } catch {
      // Silent fail
    }
  }

  if (loading) {
    return <p className="text-center text-gray-500 py-8">Loading...</p>;
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Total Received</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              SGD {totalAmount.toLocaleString("en-SG")}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Count</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{count}</p>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      {angpaoList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No angpao received yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {angpaoList.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 text-sm">{item.senderName}</p>
                  {item.isAnonymous && (
                    <Badge variant="default">Anonymous</Badge>
                  )}
                </div>
                <p className="text-lg font-bold text-red-600 mt-1">
                  {item.currency} {Number(item.amount).toLocaleString("en-SG")}
                </p>
                {item.message && (
                  <p className="text-sm text-gray-600 mt-1 italic truncate">
                    &ldquo;{item.message}&rdquo;
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleDateString("en-SG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="ml-3">
                {item.isThanked ? (
                  <Badge variant="success">Thanked ✓</Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleThank(item.id)}
                  >
                    Thank
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
