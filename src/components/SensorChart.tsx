"use client";

// Recharts에서 필요한 컴포넌트만 가져오기
import {
  LineChart, // 라인 차트 컨테이너
  Line, // 실제 데이터 라인
  XAxis, // X축 (시간)
  YAxis, // Y축 (값)
  Tooltip, // 마우스 호버 시 팝업
  ReferenceLine, // 임계값 기준선
  ResponsiveContainer, // 부모 크기에 맞게 자동 조절
} from "recharts";

// ── 차트 데이터 타입 ──────────────────────────
interface ChartData {
  time: string; // X축에 표시할 시간 (현재는 숫자를 문자열로)
  value: number; // Y축에 표시할 센서 값
}

// ── SensorChart 컴포넌트 Props 타입 ──────────
interface SensorChartProps {
  data: ChartData[]; // 최근 20개 센서 이력 데이터
  color: string; // 상태에 따른 라인 색상 (green/yellow/red)
  warningAt: number; // 경고 임계값 → 노란 점선으로 표시
  alarmAt: number; // 알람 임계값 → 빨간 점선으로 표시
}

// ── SensorChart 컴포넌트 ──────────────────────
export default function SensorChart({
  data,
  color,
  warningAt,
  alarmAt,
}: SensorChartProps) {
  return (
    // ResponsiveContainer: 부모 div 너비에 맞게 자동으로 크기 조절
    // height={80}: 차트 높이 80px 고정
    <ResponsiveContainer width="100%" height={80}>
      {/* LineChart: 실제 차트 컨테이너. data 배열을 받아 렌더링 */}
      <LineChart data={data}>
        {/* XAxis: 시간축. hide=true → 화면에 안 보이지만 내부 계산에 사용 */}
        <XAxis dataKey="time" hide />

        {/* YAxis: 값축. hide=true → 화면에 안 보이지만 내부 계산에 사용 */}
        <YAxis hide />

        {/* Tooltip: 마우스를 차트 위에 올리면 현재 값 팝업 표시 */}
        <Tooltip
          contentStyle={{
            background: "#1e293b", // 팝업 배경색 (slate-800)
            border: "1px solid #334155", // 팝업 테두리색
            borderRadius: "6px", // 팝업 모서리 둥글게
            fontSize: "11px", // 팝업 글자 크기
            color: "#e2e8f0", // 팝업 글자색
          }}
        />

        {/* ReferenceLine: 경고 임계값 → 노란 점선으로 차트에 수평선 표시 */}
        <ReferenceLine
          y={warningAt} // Y값 위치 (예: 온도 60°C)
          stroke="#f59e0b" // 노란색
          strokeDasharray="3 3" // 점선 패턴 (3px 선 + 3px 공백)
          strokeWidth={1}
        />

        {/* ReferenceLine: 알람 임계값 → 빨간 점선으로 차트에 수평선 표시 */}
        <ReferenceLine
          y={alarmAt} // Y값 위치 (예: 온도 72°C)
          stroke="#ef4444" // 빨간색
          strokeDasharray="3 3" // 점선 패턴
          strokeWidth={1}
        />

        {/* Line: 실제 센서 데이터를 라인으로 그림 */}
        <Line
          type="monotone" // 부드러운 곡선으로 연결
          dataKey="value" // data 배열에서 value 키를 사용
          stroke={color} // 상태별 색상 (green/yellow/red)
          strokeWidth={1.5} // 라인 두께
          dot={false} // 데이터 포인트 점 표시 안 함 (성능)
          isAnimationActive={false} // 애니메이션 끔 (실시간 업데이트 시 깜빡임 방지)
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
