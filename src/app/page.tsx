export default function Home() {
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

        {/* 센서 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 정상 카드 */}
          <div className="border-l-4 border-green-500 bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-400 text-sm">Press-01 온도</span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                NORMAL
              </span>
            </div>
            <div className="text-3xl font-mono font-bold text-green-400">
              23.4
              <span className="text-sm text-slate-400 ml-1">°C</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 font-mono">D001</div>
          </div>

          {/* 경고 카드 */}
          <div className="border-l-4 border-yellow-500 bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-400 text-sm">Motor-03 진동</span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                WARNING
              </span>
            </div>
            <div className="text-3xl font-mono font-bold text-yellow-400">
              7.2
              <span className="text-sm text-slate-400 ml-1">mm/s</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 font-mono">D002</div>
          </div>

          {/* 정상 카드 */}
          <div className="border-l-4 border-green-500 bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-400 text-sm">Pump-02 압력</span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                NORMAL
              </span>
            </div>
            <div className="text-3xl font-mono font-bold text-green-400">
              112.6
              <span className="text-sm text-slate-400 ml-1">kPa</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 font-mono">D003</div>
          </div>

          {/* 알람 카드 */}
          <div className="border-l-4 border-red-500 bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-400 text-sm">Conveyor-01 전류</span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                ALARM
              </span>
            </div>
            <div className="text-3xl font-mono font-bold text-red-400">
              18.9
              <span className="text-sm text-slate-400 ml-1">A</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 font-mono">D004</div>
          </div>
        </div>
      </main>
    </div>
  );
}
