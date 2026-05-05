"use client";

type SensorStatus = "normal" | "warning" | "alarm" | "offline";

interface SensorCardProps {
  deviceId: string;
  label: string;
  value: number;
  unit: string;
  status: SensorStatus;
}

const STATUS_STYLE = {
  normal: {
    border: "border-green-500",
    text: "text-green-400",
    badge: "bg-green-500/20",
    badgeText: "text-green-400",
    label: "NORMAL",
  },
  warning: {
    border: "border-yellow-500",
    text: "text-yellow-400",
    badge: "bg-yellow-500/20",
    badgeText: "text-yellow-400",
    label: "WARNING",
  },
  alarm: {
    border: "border-red-500",
    text: "text-red-400",
    badge: "bg-red-500/20",
    badgeText: "text-red-400",
    label: "ALARM",
  },
  offline: {
    border: "border-gray-600",
    text: "text-gray-500",
    badge: "bg-gray-500/20",
    badgeText: "text-gray-400",
    label: "OFFLINE",
  },
};

export default function SensorCard({
  deviceId,
  label,
  value,
  unit,
  status,
}: SensorCardProps) {
  const style = STATUS_STYLE[status];

  return (
    <div className={`border-l-4 ${style.border} bg-slate-800 rounded-lg p-4`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-slate-400 text-sm">{label}</span>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${style.badge} ${style.badgeText}`}
        >
          {style.label}
        </span>
      </div>
      <div className={`text-3xl font-mono font-bold ${style.text}`}>
        {value.toFixed(1)}
        <span className="text-sm text-slate-400 ml-1">{unit}</span>
      </div>
      <div className="text-xs text-slate-500 mt-2 font-mono">{deviceId}</div>
    </div>
  );
}
