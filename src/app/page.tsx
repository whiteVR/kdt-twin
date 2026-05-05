"use client"; // 브라우저에서 실행되는 클라이언트 컴포넌트 선언 (useState, useEffect 사용 시 필수)

// React 훅 가져오기
import { useState, useEffect, useRef } from "react";
// SensorCard 컴포넌트 가져오기
import SensorCard from "@/components/SensorCard";

// ── 타입 정의 ──────────────────────────────────
// 센서 상태: 4가지 값만 허용
type SensorStatus = "normal" | "warning" | "alarm" | "offline";

// 차트에 사용할 데이터 포인트 타입
interface ChartData {
  time: string; // X축 시간 (tick 번호를 문자열로)
  value: number; // Y축 센서 값
}

// 센서 전체 정보 타입
interface Sensor {
  deviceId: string; // 디바이스 고유 ID (예: D001)
  label: string; // 화면에 표시할 이름 (예: Press-01 온도)
  value: number; // 현재 센서 값
  unit: string; // 단위 (예: °C, mm/s)
  status: SensorStatus; // 현재 상태 (normal/warning/alarm/offline)
  min: number; // 센서 최솟값 (ProgressBar용)
  max: number; // 센서 최댓값 (ProgressBar용)
  warningAt: number; // 경고 임계값 → 이 값 이상이면 warning
  alarmAt: number; // 알람 임계값 → 이 값 이상이면 alarm
  history: ChartData[]; // 최근 20개 이력 데이터 (차트용)
}

// ── 유틸리티 함수 ───────────────────────────────

// 현재 값과 임계값을 비교해서 상태를 자동 계산
function calcStatus(
  value: number,
  warningAt: number,
  alarmAt: number,
): SensorStatus {
  if (value >= alarmAt) return "alarm"; // 알람 임계값 이상
  if (value >= warningAt) return "warning"; // 경고 임계값 이상
  return "normal"; // 정상
}

// 초기 히스토리 20개 생성 (페이지 로드 시 차트가 비어있지 않도록)
function makeHistory(base: number): ChartData[] {
  return Array.from({ length: 20 }, (_, i) => ({
    time: `${i}`,
    // base값 기준으로 ±1 범위의 랜덤값 생성
    value: Math.round((base + (Math.random() - 0.5) * 2) * 10) / 10,
  }));
}

// ── 초기 센서 데이터 ────────────────────────────
const INITIAL_SENSORS: Sensor[] = [
  {
    deviceId: "D001",
    label: "Press-01 온도",
    value: 23.4,
    unit: "°C",
    status: "normal",
    min: 0,
    max: 80,
    warningAt: 60,
    alarmAt: 72,
    history: makeHistory(23.4),
  },
  {
    deviceId: "D002",
    label: "Motor-03 진동",
    value: 7.2,
    unit: "mm/s",
    status: "warning",
    min: 0,
    max: 10,
    warningAt: 6,
    alarmAt: 8.5,
    history: makeHistory(7.2),
  },
  {
    deviceId: "D003",
    label: "Pump-02 압력",
    value: 112.6,
    unit: "kPa",
    status: "normal",
    min: 80,
    max: 150,
    warningAt: 130,
    alarmAt: 142,
    history: makeHistory(112.6),
  },
  {
    deviceId: "D004",
    label: "Conveyor-01 전류",
    value: 18.9,
    unit: "A",
    status: "alarm",
    min: 0,
    max: 20,
    warningAt: 15,
    alarmAt: 18,
    history: makeHistory(18.9),
  },
];

// ── 메인 컴포넌트 ───────────────────────────────
export default function Home() {
  // sensors: 전체 센서 데이터 배열 상태
  // setSensors: 센서 데이터를 업데이트하는 함수
  const [sensors, setSensors] = useState<Sensor[]>(INITIAL_SENSORS);

  // tickRef: 매 초마다 증가하는 카운터 (X축 시간값으로 사용)
  // useRef를 사용하는 이유: 값이 바뀌어도 리렌더링 불필요
  const tickRef = useRef(20);

  useEffect(() => {
    // setInterval: 1000ms(1초)마다 아래 함수 실행
    const id = setInterval(() => {
      tickRef.current += 1; // 틱 카운터 증가

      setSensors((prev) =>
        prev.map((sensor) => {
          // ±1 범위의 랜덤 변화량 생성
          const change = (Math.random() - 0.5) * 2;

          // 새 값 계산: min~max 범위를 벗어나지 않도록 클램핑
          const newValue =
            Math.round(
              Math.max(
                sensor.min,
                Math.min(sensor.max, sensor.value + change),
              ) * 10,
            ) / 10;

          // 슬라이딩 윈도우: 가장 오래된 값 제거(slice(1)) + 새 값 추가
          // → 항상 최근 20개 데이터만 유지
          const newHistory = [
            ...sensor.history.slice(1),
            { time: `${tickRef.current}`, value: newValue },
          ];

          return {
            ...sensor, // 기존 센서 데이터 복사
            value: newValue, // 새 값으로 업데이트
            status: calcStatus(newValue, sensor.warningAt, sensor.alarmAt), // 상태 재계산
            history: newHistory, // 이력 업데이트
          };
        }),
      );
    }, 1000); // 1초 간격

    // 클린업 함수: 컴포넌트가 사라질 때 타이머 정리 (메모리 누수 방지)
    return () => clearInterval(id);
  }, []); // [] = 마운트 시 1회만 실행

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* ── 사이드바 ── */}
      <aside className="w-52 bg-slate-800 border-r border-slate-700 p-4">
        <div className="font-bold text-sm mb-6 text-slate-300">KDT 트윈</div>
        <nav className="flex flex-col gap-1">
          {/* 현재 활성 메뉴: bg-slate-700로 강조 */}
          <div className="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm">
            대시보드
          </div>
          <div className="px-3 py-2 rounded-lg text-slate-400 text-sm hover:bg-slate-700 cursor-pointer">
            알림
          </div>
          <div className="px-3 py-2 rounded-lg text-slate-400 text-sm hover:bg-slate-700 cursor-pointer">
            설정
          </div>
        </nav>
      </aside>

      {/* ── 메인 영역 ── */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-xl font-semibold mb-6">Line-01 실시간 현황</h1>

        {/* 센서 카드 그리드
            - grid-cols-1: 모바일 1열
            - md:grid-cols-2: 중간 화면 2열
            - lg:grid-cols-4: 큰 화면 4열 (반응형) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* sensors 배열을 순회하며 SensorCard 컴포넌트 렌더링 */}
          {sensors.map((sensor) => (
            <SensorCard
              key={sensor.deviceId} // React가 각 카드를 구분하는 고유 키
              deviceId={sensor.deviceId}
              label={sensor.label}
              value={sensor.value}
              unit={sensor.unit}
              status={sensor.status}
              history={sensor.history}
              warningAt={sensor.warningAt}
              alarmAt={sensor.alarmAt}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
