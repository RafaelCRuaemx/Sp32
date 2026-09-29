import React, { useState } from 'react';
import { appConfig, getCardRadiusClass, getCardShadowClass } from '../config/appConfig';
import AttendanceChart from '../components/AttendanceChart';

/**
 * DashboardView- Pantalla 1 Resumen y metricas del sisdtema RFID
 * La grafica es renderizada por AttendanceChart (src/components/AttedanceChart.jsx)
 * Tipo activo: appConfig.layout.dashboard.chart.type
*/

export default function DashboardView() {
  const [kpis] = useState({
    totalPadron: 250,
    asistencias: 218,
    porcentajeAsistencia: 87.2,
    retardos: 19,
    porcentajeRetardos: 7.6,
    inasistencias: 13,
    porcentajeInasistencias: 5.2,
  });
  const isVespertino = appConfig.dashboardSchedule?.activeShift === 'vespertino';
  const [hourlyFlow] = useState(
    isVespertino
      ? [
          { hour: '13:30', count: 15, height: '22%' },
          { hour: '14:00', count: 62, height: '70%' },
          { hour: '14:15', count: 88, height: '100%' },
          { hour: '14:30', count: 39, height: '44%' },
          { hour: '14:45', count: 21, height: '26%' },
          { hour: '15:00', count: 8, height: '12%' },
          { hour: '15:30', count: 3, height: '5%' },
        ]
      : [
          { hour: '06:30', count: 12, height: '18%' },
          { hour: '07:00', count: 58, height: '65%' },
          { hour: '07:15', count: 95, height: '100%' },
          { hour: '07:30', count: 42, height: '48%' },
          { hour: '07:45', count: 19, height: '24%' },
          { hour: '08:00', count: 6, height: '10%' },
          { hour: '08:30', count: 4, height: '6%' },
        ]
  );
  const [recentScans] = useState([
    { id: 1, name: 'Valeria Morales Cruz', matricula: '202303001', uid: '9A:4B:C1:20', time: '07:44:12 AM', status: 'retardo' },
    { id: 2, name: 'Diego Fernando Ruiz', matricula: '202303014', uid: '3D:88:5A:F2', time: '07:29:50 AM', status: 'a_tiempo' },
    { id: 3, name: 'Sofia Elizabeth Lara', matricula: '202303088', uid: 'B1:05:44:E9', time: '07:28:10 AM', status: 'a_tiempo' },
    { id: 4, name: 'Carlos Mendoza Rios', matricula: '202303045', uid: 'FF:20:11:09', time: '07:15:33 AM', status: 'a_tiempo' },
  ]);

  const targetPercentage = appConfig.dashboardSchedule?.targetAttendancePercentage || 85;
  const isBelowTarget = kpis.porcentajeAsistencia < targetPercentage;

  const cardRadius = getCardRadiusClass();
  const cardShadow = getCardShadowClass();
  const kpiColumns = appConfig.layout?.dashboard?.kpiColumns || 4;
  const showHourlyChart = appConfig.layout?.dashboard?.showHourlyChart !== false;
  const showHardwareCard = appConfig.layout?.dashboard?.showHardwareCard !== false;
  const showRecentScans = appConfig.layout?.dashboard?.showRecentScans !== false;
  const isStacked = appConfig.layout?.dashboard?.chartLayout === 'stacked';
  const widgetsOrder = appConfig.layout?.dashboard?.widgetsOrder || ['kpis' , 'charts', 'recentScans'];

  const kpiGridClass =
    kpiColumns === 2
      ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
      : kpiColumns === 3
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4';

       const renderKpis = () => (
    <div key="kpis" className={kpiGridClass}>
      <div className={`theme-card border ${cardRadius} p-5 ${cardShadow}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total de Usuarios</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">TOTAL</span>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-extrabold text-slate-900 font-mono">{kpis.totalPadron}</span>
          <p className="text-xs text-slate-500 mt-1">Usuarios registrados en sistema</p>
        </div>
      </div>
      <div className={`theme-card border ${cardRadius} p-5 ${cardShadow}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Asistencias</span>
          <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
            isBelowTarget ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {kpis.porcentajeAsistencia}% {isBelowTarget && `(Meta: ${targetPercentage}%)`}
          </span>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-extrabold text-slate-900 font-mono">{kpis.asistencias}</span>
          <p className="text-xs text-slate-500 mt-1">Ingresos dentro de tolerancia ({appConfig.schedule.horaEntrada})</p>
        </div>
      </div>
      <div className={`theme-card border ${cardRadius} p-5 ${cardShadow}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Retardos</span>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            {kpis.porcentajeRetardos}%
          </span>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-extrabold text-slate-900 font-mono">{kpis.retardos}</span>
          <p className="text-xs text-slate-500 mt-1">Posterior a {appConfig.schedule.horaEntrada}</p>
        </div>
      </div>
      <div className={`theme-card border ${cardRadius} p-5 ${cardShadow}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inasistencias</span>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
            {kpis.porcentajeInasistencias}%
          </span>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-extrabold text-slate-900 font-mono">{kpis.inasistencias}</span>
          <p className="text-xs text-slate-500 mt-1">Sin lectura registrada hoy</p>
        </div>
      </div>
    </div>
  );

  const renderChartsAndHardware = () => {
    if (!showHourlyChart && !showHardwareCard) return null;

    const chartConfig = appConfig.layout?.dashboard?.chart || {};
    const showPeakBadge = chartConfig.showPeakBadge !== false;
    const maxScans = Math.max(...hourlyFlow.map((i) => i.count), 1);
    const peakItem = hourlyFlow.find((i) => i.count === maxScans) || hourlyFlow[0];
    
   return (
      <div key="charts" className={isStacked ? 'flex flex-col gap-6' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
        {showHourlyChart && (
          <div className={`${isStacked || !showHardwareCard ? 'w-full' : 'lg:col-span-2'} theme-card border ${cardRadius} p-6 ${cardShadow}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Flujo de Accesos por Hora</h2>
                <p className="text-xs text-slate-500">Lecturas de tarjetas RFID registradas en torniquetes</p>
              </div>
              {showPeakBadge && (
                <span className="text-xs font-mono theme-accent-light px-2.5 py-1 rounded border font-semibold shadow-2xs">
                  Pico: {peakItem?.count} scans ({peakItem?.hour})
                </span>
              )}
            </div>
            <AttendanceChart
              chartConfig={chartConfig}
              hourlyFlow={hourlyFlow}
              kpis={kpis}
            />
          </div>
        )}
        {showHardwareCard && (
          <div className={`${isStacked || !showHourlyChart ? 'w-full' : 'lg:col-span-1'} theme-card border ${cardRadius} p-6 ${cardShadow} flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h2 className="text-base font-semibold text-slate-900">Hardware {appConfig.hardware.label}</h2>
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {appConfig.hardware.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Módulo Lector:</span>
                  <span className="font-mono text-slate-800 font-semibold">RC522 (13.56 MHz)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">IP Asignada:</span>
                  <span className="font-mono theme-text-primary font-semibold">{appConfig.hardware.ip}</span>
                </div>
                {appConfig.telemetry?.showWifiSignal !== false && (
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Señal WiFi:</span>
                    <span className="font-mono text-emerald-700 font-semibold">-58 dBm (Excelente)</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Protocolo:</span>
                  <span className="font-mono text-slate-800">HTTP REST / JSON</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-500 font-medium">Punto de Acceso:</span>
                  <span className="text-slate-800 font-medium">{appConfig.hardware.name}</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-mono block">Firmware ESP32 v2.4 • Conectado a Django API</span>
            </div>
          </div>
        )}
      </div>
    );
  };  
   const renderRecentScans = () => {
    if (!showRecentScans) return null;
    return (
      <div key="recentScans" className={`theme-card border ${cardRadius} overflow-hidden ${cardShadow}`}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Últimos Accesos Detectados (Tiempo Real)</h2>
          <span className="text-xs text-slate-500 font-mono">EN VIVO</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-mono">
              <tr>
                <th className="px-6 py-3">Alumno</th>
                <th className="px-6 py-3">Matrícula</th>
                <th className="px-6 py-3">UID Tarjeta</th>
                <th className="px-6 py-3">Hora de Ingreso</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3 font-medium text-slate-900">{scan.name}</td>
                  <td className="px-6 py-3 font-mono text-slate-600">{scan.matricula}</td>
                  <td className="px-6 py-3 font-mono text-indigo-900 font-semibold">{scan.uid}</td>
                  <td className="px-6 py-3 text-slate-500 font-mono">{scan.time}</td>
                  <td className="px-6 py-3">
                    {(() => {
                      const isOntime = scan.status === 'a_tiempo' || String(scan.status).toLowerCase().includes('tiempo');
                      const key = isOntime ? 'a_tiempo' : 'retardo';
                      const st = appConfig.statusLabels?.[key] || {
                        label: isOntime ? 'A tiempo' : 'Retardo',
                        color: isOntime ? 'emerald' : 'amber',
                      };
                      const colorClass =
                        st.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : st.color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200';
                      return (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
                          {st.label}
                        </span>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-sm text-slate-500">{appConfig.institution.name} • Monitoreo en tiempo real</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            Hora oficial: {appConfig.schedule.horaEntrada} (Tolerancia: {appConfig.schedule.horaTolerancia})
          </span>
        </div>
      </div>
      {widgetsOrder.map((sectionKey) => {
        switch (sectionKey) {
          case 'kpis': return renderKpis();
          case 'charts': return renderChartsAndHardware();
          case 'recentScans': return renderRecentScans();
          default: return null;
        }
      })}
    </div>
  );
}