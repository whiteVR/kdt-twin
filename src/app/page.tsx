"use client";

import { useState, useEffect, useRef } from "react";
import SensorCard from "@/components/SensorCard";

type SensorStatus = "normal" | "warning" | "alarm" | "offline";

interface Sensor {
  deviceId: string;
  label: string;
  value: number;
  unit: string;
  status: SensorStatus;
  min: number;
  max: number;
  warningAt: number;
  alarmAt: number;
}

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
  },
];

// 값에 따라 상태 자동 계산
function calcStatus(
  value: number,
  warningAt: number,
  alarmAt: number,
): SensorStatus {
  if (value >= alarmAt) return "alarm";
  if (value >= warningAt) return "warning";
  return "normal";
}

export default function Home() {
  const [sensors, setSensors] = useState<Sensor[]>(INITIAL_SENSORS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // 1초마다 센서값 업데이트
    intervalRef.current = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => {
          const change = (Math.random() - 0.5) * 2;
          const newValue = Math.max(
            sensor.min,
            Math.min(sensor.max, sensor.value + change),
          );
          return {
            ...sensor,
            value: Math.round(newValue * 10) / 10,
            status: calcStatus(newValue, sensor.warningAt, sensor.alarmAt),
          };
        }),
      );
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* 사이드바 */}
      <aside className="w-52 bg-slate-800 border-r border-slate-700 p-4">
        <div className="font-bold text-sm mb-6 text-slate-300">KDT 트윈</div>
        <nav className="flex flex-col gap-1">
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

      {/* 메인 영역 */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-xl font-semibold mb-6">Line-01 실시간 현황</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sensors.map((sensor) => (
            <SensorCard
              key={sensor.deviceId}
              deviceId={sensor.deviceId}
              label={sensor.label}
              value={sensor.value}
              unit={sensor.unit}
              status={sensor.status}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
