import { BarChart3, TrendingUp, Users, Heart, Camera } from "lucide-react";

export default function OrganizerAnalyticsPage() {
  // Mock analytics data for UI preview
  const weeklyData = [
    { label: "Mon", rsvps: 4, angpao: 2 },
    { label: "Tue", rsvps: 7, angpao: 3 },
    { label: "Wed", rsvps: 3, angpao: 5 },
    { label: "Thu", rsvps: 8, angpao: 1 },
    { label: "Fri", rsvps: 12, angpao: 6 },
    { label: "Sat", rsvps: 18, angpao: 9 },
    { label: "Sun", rsvps: 14, angpao: 4 },
  ];
  const maxVal = Math.max(...weeklyData.map((d) => d.rsvps));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Track performance across all your events</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: <TrendingUp size={18} />, label: "Conversion rate", value: "68%", color: "bg-blue-50 text-blue-600" },
          { icon: <Users size={18} />, label: "Avg guests/event", value: "142", color: "bg-green-50 text-green-600" },
          { icon: <Heart size={18} />, label: "Avg angpao/event", value: "$2,840", color: "bg-red-50 text-surat-red-500" },
          { icon: <Camera size={18} />, label: "Photos/event", value: "326", color: "bg-purple-50 text-purple-600" },
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
          </div>
        ))}
      </div>

      {/* Chart mockup */}
      <div className="card p-6">
        <h3 className="font-serif text-lg text-surat-neutral-900 mb-5">Weekly RSVPs</h3>
        <div className="flex items-end gap-2 h-[160px]">
          {weeklyData.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full bg-surat-red-100 rounded-t-md transition-all"
                style={{ height: `${(d.rsvps / maxVal) * 100}%`, minHeight: "8px" }}
              />
              <span className="text-[10px] text-surat-neutral-400">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-surat-neutral-400 text-center">
        Showing mock data. Real analytics will populate once events are connected.
      </p>
    </div>
  );
}
