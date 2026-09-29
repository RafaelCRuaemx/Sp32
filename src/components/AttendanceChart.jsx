import React from "react";

export default function AttendanceChart ({
  chartConfig = {},
  hourlyFlow = [],
  kpis = {},
}){
  const chartType = chartConfig.type || 'donut';
  const chartColor = chartConfig.color || 'theme';
  const barShape = chartConfig.barShape || 'rounded';
  const showAverageLine = chartConfig.showAverageLine !== false;
   
  const maxScans = Math.max(...hourlyFlow.map((i) => i.count), 1);
  const avgScans = Math.round(hourlyFlow.reduce((acc, curr) => acc + curr.count, 0)/ (hourlyFlow.length || 1));
  const avgPercent = Math.min(Math.round((avgScans / maxScans)* 100), 100);

const shapeClass =
    barShape === 'square' ? 'rounded-none'
    : barShape === 'pill' ? 'rounded-t-full'
    : 'rounded-t-lg';  

const getPrimaryHex = () => {
    switch (chartColor) {
      case 'emerald': return '#059669';
      case 'sky':     return '#0284c7';
      case 'amber':   return '#d97706';
      case 'rose':    return '#e11d48';
      case 'slate':   return '#334155';
      default:        return 'var(--color-primary)';
    }
  };
  const primaryHex = getPrimaryHex();
  const getBarStyle = () => {
    switch (chartColor) {
      case 'gradient': return { background: 'linear-gradient(to top, var(--color-primary), var(--color-accent))' };
      case 'emerald':  return { background: 'linear-gradient(to top, #059669, #34d399)' };
      case 'sky':      return { background: 'linear-gradient(to top, #0284c7, #38bdf8)' };
      case 'amber':    return { background: 'linear-gradient(to top, #d97706, #fbbf24)' };
      case 'rose':     return { background: 'linear-gradient(to top, #e11d48, #fb7185)' };
      case 'slate':    return { background: 'linear-gradient(to top, #334155, #64748b)' };
      default:         return { backgroundColor: 'var(--color-primary)' };
    }
  };


 const svgWidth = 600;
  const svgHeight = 180;
  const svgPoints = hourlyFlow.map((item, idx) => ({
    x: Math.round((idx / (hourlyFlow.length - 1 || 1)) * (svgWidth - 40) + 20),
    y: Math.round(svgHeight - 15 - (item.count / maxScans) * (svgHeight - 45)),
    count: item.count,
    hour: item.hour,
  }));

  const pathD = svgPoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cp1x = Math.round(prev.x + (pt.x - prev.x) / 2);
    return `${acc} C ${cp1x},${prev.y} ${cp1x},${pt.y} ${pt.x},${pt.y}`;
  }, '');
  const areaD = `${pathD} L ${svgPoints[svgPoints.length - 1]?.x || svgWidth},${svgHeight - 10} L ${svgPoints[0]?.x || 0},${svgHeight - 10} Z`;
  const stepD = svgPoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    return `${acc} L ${pt.x},${prev.y} L ${pt.x},${pt.y}`;
  }, '');
  const stepAreaD = `${stepD} L ${svgPoints[svgPoints.length - 1]?.x || svgWidth},${svgHeight - 10} L ${svgPoints[0]?.x || 0},${svgHeight - 10} Z`;
  const circ = 2 * Math.PI * 62;
  const pctAsist = Math.max(0, Math.min(100, kpis.porcentajeAsistencia || 82.5));
  const pctRet   = Math.max(0, Math.min(100, kpis.porcentajeRetardos    || 10.3));
  const pctInas  = Math.max(0, Math.min(100, kpis.porcentajeInasistencias || 7.2));
  const dashAsist = (pctAsist / 100) * circ;
  const dashRet   = (pctRet   / 100) * circ;
  const dashInas  = (pctInas  / 100) * circ;
  const gaugeCirc = Math.PI * 75;
  const gaugeDash = (Math.min(Math.max(pctAsist, 0), 100) / 100) * gaugeCirc;
  const totalScansSum = hourlyFlow.reduce((acc, curr) => acc + curr.count, 0) || 520;
  const accessPoints = [
    { name: 'Torniquete 01 (Principal)',          count: Math.round(totalScansSum * 0.42), pct: 42, color: primaryHex  },
    { name: 'Torniquete 02 (Secundario)',          count: Math.round(totalScansSum * 0.28), pct: 28, color: '#0284c7'  },
    { name: 'Torniquete 03 (Biblioteca/Talleres)', count: Math.round(totalScansSum * 0.18), pct: 18, color: '#f59e0b'  },
    { name: 'Acceso Vehicular / Docentes',         count: Math.round(totalScansSum * 0.12), pct: 12, color: '#8b5cf6'  },
  ];
  /* ---- 1. DONUT ---- */
  if (chartType === 'donut') {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2 pb-1">
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width="180" height="180" viewBox="0 0 180 180" className="rotate-[-90deg]">
            <circle cx="90" cy="90" r="62" stroke="#f1f5f9" strokeWidth="20" fill="none" />
            <circle cx="90" cy="90" r="62" stroke={primaryHex} strokeWidth="20" fill="none"
              strokeDasharray={`${dashAsist} 400`} strokeDashoffset="0" className="transition-all duration-700" />
            <circle cx="90" cy="90" r="62" stroke="#f59e0b" strokeWidth="20" fill="none"
              strokeDasharray={`${dashRet} 400`} strokeDashoffset={`-${dashAsist}`} className="transition-all duration-700" />
            <circle cx="90" cy="90" r="62" stroke="#e11d48" strokeWidth="20" fill="none"
              strokeDasharray={`${dashInas} 400`} strokeDashoffset={`-${dashAsist + dashRet}`} className="transition-all duration-700" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">{pctAsist}%</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Asistencia</span>
          </div>
        </div>
        <div className="space-y-2.5 w-full max-w-xs text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryHex }} />
              <span className="font-semibold text-slate-700">A tiempo</span>
            </div>
            <span className="font-mono font-bold text-slate-900">{kpis.asistencias} ({pctAsist}%)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-700">Retardos</span>
            </div>
            <span className="font-mono font-bold text-amber-700">{kpis.retardos} ({pctRet}%)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="font-semibold text-slate-700">Inasistencias</span>
            </div>
            <span className="font-mono font-bold text-rose-700">{kpis.inasistencias} ({pctInas}%)</span>
          </div>
        </div>
      </div>
    );
  }
  /* ---- 2. GAUGE ---- */
  if (chartType === 'gauge') {
    return (
      <div className="flex flex-col items-center justify-center pt-2 pb-2">
        <div className="relative flex items-center justify-center">
          <svg width="240" height="135" viewBox="0 0 200 115" className="overflow-visible">
            <path d="M 25 100 A 75 75 0 0 1 175 100" fill="none" stroke="#e2e8f0" strokeWidth="16" strokeLinecap="round" />
            <path d="M 25 100 A 75 75 0 0 1 175 100" fill="none" stroke={primaryHex} strokeWidth="16"
              strokeLinecap="round" strokeDasharray={`${gaugeDash} 300`} className="transition-all duration-700" />
          </svg>
          <div className="absolute bottom-1 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight leading-none">{pctAsist}%</span>
            <span className="text-[11px] font-semibold text-slate-500 mt-1">Cumplimiento General</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            <span>●</span> Meta Escolar: 85%
          </div>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 font-mono">{kpis.asistencias} de {kpis.totalAlumnos} alumnos</span>
        </div>
      </div>
    );
  }
  /* ---- 3. HORIZONTAL-BARS ---- */
  if (chartType === 'horizontal-bars') {
    return (
      <div className="space-y-4 pt-2 pb-1">
        {accessPoints.map((pt, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">{pt.name}</span>
              <span className="font-mono text-slate-500"><strong className="text-slate-900">{pt.count}</strong> scans ({pt.pct}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/50">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pt.pct}%`, backgroundColor: pt.color }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  /* ---- 4. STEP ---- */
  if (chartType === 'step') {
    return (
      <div className="relative pt-2">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 overflow-visible">
          <defs>
            <linearGradient id="stepGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryHex} stopOpacity="0.35" />
              <stop offset="100%" stopColor={primaryHex} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {showAverageLine && (
            <line x1="10" y1={svgHeight - 15 - (avgPercent / 100) * (svgHeight - 45)}
              x2={svgWidth - 10} y2={svgHeight - 15 - (avgPercent / 100) * (svgHeight - 45)}
              stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          )}
          <path d={stepAreaD} fill="url(#stepGradient)" />
          <path d={stepD} fill="none" stroke={primaryHex} strokeWidth="3" strokeLinejoin="miter" />
          {svgPoints.map((pt, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle cx={pt.x} cy={pt.y} r="10" fill={primaryHex} className="opacity-0 group-hover:opacity-20 transition-opacity" />
              <circle cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke={primaryHex} strokeWidth="2.5" />
              <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <rect x={Math.max(10, Math.min(svgWidth - 90, pt.x - 40))} y={Math.max(5, pt.y - 32)} width="80" height="24" rx="6" fill="#0f172a" />
                <text x={Math.max(10, Math.min(svgWidth - 90, pt.x - 40)) + 40} y={Math.max(5, pt.y - 32) + 16}
                  fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">{pt.count} scans</text>
              </g>
            </g>
          ))}
        </svg>
        <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
          {hourlyFlow.map((item, idx) => <span key={idx} className="text-center font-mono text-[11px]">{item.hour}</span>)}
        </div>
      </div>
    );
  }
  /* ---- 5. AREA ---- */
  if (chartType === 'area') {
    return (
      <div className="relative pt-2">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryHex} stopOpacity="0.45" />
              <stop offset="100%" stopColor={primaryHex} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {showAverageLine && (
            <line x1="10" y1={svgHeight - 15 - (avgPercent / 100) * (svgHeight - 45)}
              x2={svgWidth - 10} y2={svgHeight - 15 - (avgPercent / 100) * (svgHeight - 45)}
              stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          )}
          <path d={areaD} fill="url(#areaGradient)" />
          <path d={pathD} fill="none" stroke={primaryHex} strokeWidth="3" strokeLinecap="round" />
          {svgPoints.map((pt, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle cx={pt.x} cy={pt.y} r="11" fill={primaryHex} className="opacity-0 group-hover:opacity-20 transition-opacity" />
              <circle cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke={primaryHex} strokeWidth="2.5" />
              <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <rect x={Math.max(10, Math.min(svgWidth - 90, pt.x - 40))} y={Math.max(5, pt.y - 32)} width="80" height="24" rx="6" fill="#0f172a" />
                <text x={Math.max(10, Math.min(svgWidth - 90, pt.x - 40)) + 40} y={Math.max(5, pt.y - 32) + 16}
                  fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">{pt.count} scans</text>
              </g>
            </g>
          ))}
        </svg>
        <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
          {hourlyFlow.map((item, idx) => <span key={idx} className="text-center font-mono text-[11px]">{item.hour}</span>)}
        </div>
      </div>
    );
  }
  /* ---- 6. BARS ---- */
  if (chartType === 'bars') {
    return (
      <div className="relative pt-2">
        {showAverageLine && (
          <div className="absolute left-0 right-0 border-b border-dashed border-slate-300 pointer-events-none z-10" style={{ bottom: `${avgPercent}%` }}>
            <span className="absolute -top-4 right-0 text-[10px] font-mono text-slate-400 bg-white/90 px-1 rounded">Promedio: {avgScans}</span>
          </div>
        )}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100">
          {hourlyFlow.map((item, idx) => {
            const h = Math.round((item.count / maxScans) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-mono font-bold text-slate-700 mb-1">{item.count}</span>
                <div className={`w-full max-w-[38px] ${shapeClass} transition-all duration-300`}
                  style={{ height: `${Math.max(h, 5)}%`, backgroundColor: primaryHex }} />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          {hourlyFlow.map((item, idx) => <span key={idx} className="flex-1 text-center font-mono text-[11px]">{item.hour}</span>)}
        </div>
      </div>
    );
  }
  /* ---- 7. GRADIENT-BARS (default) ---- */
  return (
    <div className="relative pt-2">
      {showAverageLine && (
        <div className="absolute left-0 right-0 border-b border-dashed border-slate-300 pointer-events-none z-10" style={{ bottom: `${avgPercent}%` }}>
          <span className="absolute -top-4 right-0 text-[10px] font-mono text-slate-400 bg-white/90 px-1 rounded">Promedio: {avgScans}</span>
        </div>
      )}
      <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100">
        {hourlyFlow.map((item, idx) => {
          const h = Math.round((item.count / maxScans) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono py-1 px-1.5 rounded shadow pointer-events-none z-20 whitespace-nowrap">
                {item.count} scans ({item.hour})
              </div>
              <div className={`w-full max-w-[38px] ${shapeClass} transition-all duration-300 group-hover:opacity-90`}
                style={{ height: `${Math.max(h, 4)}%`, ...getBarStyle() }} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-2">
        {hourlyFlow.map((item, idx) => <span key={idx} className="flex-1 text-center font-mono text-[11px]">{item.hour}</span>)}
      </div>
    </div>
  );
}