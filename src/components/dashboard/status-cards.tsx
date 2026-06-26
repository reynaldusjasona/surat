import { Card, CardContent } from "@/components/ui";

interface StatusCardsProps {
  counts: {
    attending: number;
    not_attending: number;
    maybe: number;
    pending: number;
    total: number;
  };
}

export function StatusCards({ counts }: StatusCardsProps) {
  const cards = [
    { label: "Attending", count: counts.attending, color: "text-green-600", bg: "bg-green-50" },
    { label: "Maybe", count: counts.maybe, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Not Attending", count: counts.not_attending, color: "text-red-600", bg: "bg-red-50" },
    { label: "Pending", count: counts.pending, color: "text-gray-600", bg: "bg-gray-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <Card key={card.label} className={card.bg}>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.count}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
