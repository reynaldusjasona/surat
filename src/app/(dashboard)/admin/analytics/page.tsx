import { BarChart3, TrendingUp, DollarSign, Users, Calendar } from "lucide-react";

export default function AdminAnalyticsPage() {
  // Mock platform analytics data
  const monthlyData = [
    { month: "Jan", events: 12, revenue: 4200 },
    { month: "Feb", events: 18, revenue: 6800 },
    { month: "Mar", events: 24, revenue: 9100 },
    { month: "Apr", events: 31, revenue: 12400 },
    { month: "May", events: 28, revenue: 11200 },
    { month: "Jun", events: 42, revenue: 16800 },
  ];
  const maxEvents = Math.max(...monthlyData.map((d) => d.events));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Platform Analytics</h1>
        <p className="page-subtitle">Platform-wide metrics and growth trends</p>
      </div>

      {/* Top-level stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: <Calendar size={18} />, label: "Events this month", value: "42", change: "+50%", color: "bg-blue-50 text-blue-600" },
          { icon: <Users size={18} />, label: "New users", value: "128", change: "+23%", color: "bg-green-50 text-green-600" },
          { icon: <DollarSign size={18} />, label: "Revenue (Jun)", value: "$16,800", change: "+34%", color: "bg-yellow-50 text-yellow-600" },
          { icon: <TrendingUp size={18} />, label: "MRR", value: "$4,740", change: "+12%", color: "bg-purple-50 text-purple-600" },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold font-mono text-surat-neutral-800">{stat.value}</p>
                <p className="text-xs text-surat-neutral-500">{stat.label}</p>
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium mt-2">{stat.change} vs last month</p>
          </div>
        ))}
      </div>

      {/* Monthly events chart */}
      <div className="card p-6">
        <h3 className="font-serif text-lg text-surat-neutral-900 mb-5">Events Created per Month</h3>
        <div className="flex items-end gap-3 h-[180px]">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-mono text-surat-neutral-600">{d.events}</span>
              <div
                className="w-full bg-surat-red-100 rounded-t-md transition-all hover:bg-surat-red-200"
                style={{ height: `${(d.events / maxEvents) * 100}%`, minHeight: "12px" }}
              />
              <span className="text-[11px] text-surat-neutral-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="card p-6">
        <h3 className="font-serif text-lg text-surat-neutral-900 mb-5">Revenue Breakdown (Jun 2026)</h3>
        <div className="space-y-3">
          {[
            { label: "Event plan fees", amount: "$2,940", pct: 17 },
            { label: "Angpao commission", amount: "$9,600", pct: 57 },
            { label: "Photo unlock fees", amount: "$4,260", pct: 26 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-surat-neutral-700">{item.label}</span>
                  <span className="font-mono font-medium text-surat-neutral-800">{item.amount}</span>
                </div>
                <div className="h-2 bg-surat-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-surat-red-400 rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
              <span className="text-xs text-surat-neutral-400 w-8 text-right">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-surat-neutral-400 text-center">
        Showing mock data. Real analytics will populate once events and transactions are processed.
      </p>
    </div>
  );
}
