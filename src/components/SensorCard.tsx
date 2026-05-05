"use client"; // 클라이언트 컴포넌트 선언 (브라우저에서만 실행)

// SensorChart 컴포넌트 가져오기
import SensorChart from "./SensorChart";

// ── 타입 정의 ──────────────────────────────────
// 센서 상태 타입: 4가지 값만 허용
type SensorStatus = "normal" | "warning" | "alarm" | "offline";

// 차트 데이터 포인트 타입
interface ChartData {
  time: string; // X축 시간값
  value: number; // Y축 센서값
}

// SensorCard가 받는 Props 타입
interface SensorCardProps {
  deviceId: string; // 디바이스 ID (예: D001)
  label: string; // 센서 이름 (예: Press-01 온도)
  value: number; // 현재 센서 값
  unit: string; // 단위 (예: °C)
  status: SensorStatus; // 현재 상태
  history: ChartData[]; // 차트용 이력 데이터 20개
  warningAt: number; // 경고 임계값
  alarmAt: number; // 알람 임계값
}

// ── 상태별 스타일 설정 ──────────────────────────
// 각 상태(normal/warning/alarm/offline)에 따른 색상 클래스 모음
// Tailwind 클래스를 객체로 관리 → 조건문 없이 status로 바로 접근 가능
const STATUS_STYLE = {
  normal: {
    border: "border-green-500", // 카드 왼쪽 액센트 바 색상
    text: "text-green-400", // 센서 값 숫자 색상
    badge: "bg-green-500/20", // 배지 배경색 (20% 투명도)
    badgeText: "text-green-400", // 배지 텍스트 색상
    label: "NORMAL", // 배지에 표시할 텍스트
    color: "#22c55e", // 차트 라인 색상 (hex)
  },
  warning: {
    border: "border-yellow-500",
    text: "text-yellow-400",
    badge: "bg-yellow-500/20",
    badgeText: "text-yellow-400",
    label: "WARNING",
    color: "#f59e0b",
  },
  alarm: {
    border: "border-red-500",
    text: "text-red-400",
    badge: "bg-red-500/20",
    badgeText: "text-red-400",
    label: "ALARM",
    color: "#ef4444",
  },
  offline: {
    border: "border-gray-600",
    text: "text-gray-500",
    badge: "bg-gray-500/20",
    badgeText: "text-gray-400",
    label: "OFFLINE",
    color: "#6b7280",
  },
};

// ── SensorCard 컴포넌트 ─────────────────────────
export default function SensorCard({
  deviceId,
  label,
  value,
  unit,
  status,
  history,
  warningAt,
  alarmAt,
}: SensorCardProps) {
  // status 값으로 STATUS_STYLE 객체에서 해당 스타일을 가져옴
  // 예: status='alarm' → STATUS_STYLE.alarm
  const style = STATUS_STYLE[status];

  return (
    // 카드 컨테이너: 왼쪽 4px 액센트 바 + 어두운 배경 + 둥근 모서리
    <div className={`border-l-4 ${style.border} bg-slate-800 rounded-lg p-4`}>
      {/* ── 카드 헤더: 센서명 + 상태 배지 ── */}
      <div className="flex justify-between items-center mb-3">
        {/* 센서 이름 */}
        <span className="text-slate-400 text-sm">{label}</span>

        {/* 상태 배지: 상태에 따라 색상 자동 변경 */}
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${style.badge} ${style.badgeText}`}
        >
          {style.label} {/* NORMAL / WARNING / ALARM / OFFLINE */}
        </span>
      </div>

      {/* ── 센서 현재 값 ── */}
      {/* toFixed(1): 소수점 1자리까지 표시 (예: 23.4) */}
      <div className={`text-3xl font-mono font-bold ${style.text}`}>
        {value.toFixed(1)}
        {/* 단위: 작은 글씨로 값 옆에 표시 */}
        <span className="text-sm text-slate-400 ml-1">{unit}</span>
      </div>

      {/* ── 실시간 미니 차트 ── */}
      {/* mt-3: 위쪽 여백 3 (12px) */}
      <div className="mt-3">
        <SensorChart
          data={history} // 최근 20개 이력 데이터
          color={style.color} // 상태별 차트 라인 색상
          warningAt={warningAt} // 경고 기준선 Y값
          alarmAt={alarmAt} // 알람 기준선 Y값
        />
      </div>

      {/* ── 디바이스 ID ── */}
      {/* 카드 하단에 작은 글씨로 표시 (예: D001) */}
      <div className="text-xs text-slate-500 mt-1 font-mono">{deviceId}</div>
    </div>
  );
}
