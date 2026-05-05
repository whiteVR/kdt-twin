// ────────────────────────────────────────
// 센서 상태 타입 — 이 4가지 값만 허용
// ────────────────────────────────────────
type SensorStatus = "normal" | "warning" | "alarm" | "offline";

// ────────────────────────────────────────
// 센서 타입 — 이 4가지 값만 허용
// ────────────────────────────────────────
type SensorType = "temperature" | "pressure" | "vibration" | "current";

// ────────────────────────────────────────
// 센서 읽기값 인터페이스
// ────────────────────────────────────────
interface SensorReading {
  deviceId: string;
  sensorType: SensorType;
  value: number;
  unit: string;
  status: SensorStatus;
  quality: "GOOD" | "BAD" | "UNCERTAIN";
  timestamp: Date;
}

// ────────────────────────────────────────
// 디바이스 인터페이스
// ────────────────────────────────────────
interface Device {
  id: string;
  name: string;
  plantId: string;
  location?: string; // ? = 없어도 되는 선택 속성
  sensors: SensorReading[];
  lastUpdated?: Date;
}

// ────────────────────────────────────────
// API 응답 제네릭 — 어떤 타입이든 감쌀 수 있음
// ────────────────────────────────────────
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
}

// ────────────────────────────────────────
// 실제 데이터 예시 — 타입 적용
// ────────────────────────────────────────
const sensorReadings: SensorReading[] = [
  {
    deviceId: "D001",
    sensorType: "temperature",
    value: 23.4,
    unit: "°C",
    status: "normal",
    quality: "GOOD",
    timestamp: new Date(),
  },
  {
    deviceId: "D002",
    sensorType: "vibration",
    value: 7.2,
    unit: "mm/s",
    status: "warning",
    quality: "GOOD",
    timestamp: new Date(),
  },
  {
    deviceId: "D003",
    sensorType: "pressure",
    value: 112.6,
    unit: "kPa",
    status: "normal",
    quality: "GOOD",
    timestamp: new Date(),
  },
  {
    deviceId: "D004",
    sensorType: "current",
    value: 18.9,
    unit: "A",
    status: "alarm",
    quality: "GOOD",
    timestamp: new Date(),
  },
];

// ────────────────────────────────────────
// 타입 안전 함수 — 상태별 색상 반환
// ────────────────────────────────────────
function getStatusColor(status: SensorStatus): string {
  const colorMap: Record<SensorStatus, string> = {
    normal: "#22c55e",
    warning: "#f59e0b",
    alarm: "#ef4444",
    offline: "#6b7280",
  };
  return colorMap[status];
}

// ────────────────────────────────────────
// 타입 오류 테스트 — 아래 줄 주석 해제하면 빨간 밑줄
// ────────────────────────────────────────
// const wrongStatus: SensorStatus = "normalll"; // ← 오류!
// const wrongReading: SensorReading = {
//   deviceId: "D001",
//   sensorType: "temperature",
//   value: "스물셋",  // ← number여야 하는데 string → 오류!
//   unit: "°C",
//   status: "normal",
//   quality: "GOOD",
//   timestamp: new Date(),
// };

console.log("센서 데이터 타입 확인:");
sensorReadings.forEach((s) => {
  const color = getStatusColor(s.status);
  console.log(
    `${s.deviceId} | ${s.sensorType} | ${s.value}${s.unit} | 색상: ${color}`,
  );
});
