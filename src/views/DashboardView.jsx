import React, { useState } from 'react';
import { appConfig } from '../config/appConfig';

/**
 * DashboardView - Pantalla 1: Resumen y métricas del sistema RFID
 * Estilo Híbrido: Área de trabajo clara con alto contraste y tarjetas blancas limpias.
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

  const [hourlyFlow] = useState([
    { hour: '06:30', count: 12, height: '18%' },
    { hour: '07:00', count: 58, height: '65%' },
    { hour: '07:15', count: 95, height: '100%' },
    { hour: '07:30', count: 42, height: '48%' },
    { hour: '07:45', count: 19, height: '24%' },
    { hour: '08:00', count: 6, height: '10%' },
    { hour: '08:30', count: 4, height: '6%' },
  ]);

  const [recentScans] = useState([
    { id: 1, name: 'Valeria Morales Cruz', matricula: '202303001', uid: '9A:4B:C1:20', time: '07:44:12 AM', status: 'Retardo' },
    { id: 2, name: 'Diego Fernando Ruiz', matricula: '202303014', uid: '3D:88:5A:F2', time: '07:29:50 AM', status: 'A tiempo' },
    { id: 3, name: 'Sofia Elizabeth Lara', matricula: '202303088', uid: 'B1:05:44:E9', time: '07:28:10 AM', status: 'A tiempo' },
    { id: 4, name: 'Carlos Mendoza Rios', matricula: '202303045', uid: 'FF:20:11:09', time: '07:15:33 AM', status: 'A tiempo' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-sm text-slate-500">
            {appConfig.institution.name} • Monitoreo en tiempo real
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {new Date().toISOString().split('T')[0]}
          </span>
        </div>
      </div>

      {/* Tarjetas de Resumen (KPIs) en blanco limpio con acentos sutiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Padrón Total */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total de Usuarios</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              TOTAL
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{kpis.totalPadron}</span>
            <p className="text-xs text-slate-500 mt-1">Usuarios registrados en sistema</p>
          </div>
        </div>

        {/* KPI 2: Asistencias */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Asistencias</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              {kpis.porcentajeAsistencia}%
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{kpis.asistencias}</span>
            <p className="text-xs text-slate-500 mt-1">Ingresos dentro de tolerancia</p>
          </div>
        </div>

        {/* KPI 3: Retardos */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Retardos</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              {kpis.porcentajeRetardos}%
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{kpis.retardos}</span>
            <p className="text-xs text-slate-500 mt-1">Acceso posterior a la hora límite</p>
          </div>
        </div>

        {/* KPI 4: Inasistencias */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inasistencias</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              {kpis.porcentajeInasistencias}%
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{kpis.inasistencias}</span>
            <p className="text-xs text-slate-500 mt-1">Sin escaneo en la jornada</p>
          </div>
        </div>
      </div>

      {/* Sección central: Gráfica de flujo + Hardware ESP32 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica de Flujo por Hora */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Flujo de Accesos</h2>
              <p className="text-xs text-slate-500">Lecturas de tarjetas RFID registradas en puerta</p>
            </div>
            <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-700 border border-slate-200">
              Pico máx: 95 scans
            </span>
          </div>

          {/* Barras de la gráfica */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-200">
            {hourlyFlow.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip con cantidad */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-xs px-2 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-md font-mono">
                  {item.count} accesos
                </div>
                {/* Barra */}
                <div
                  style={{ height: item.height }}
                  className="w-full max-w-[42px] bg-slate-700 group-hover:bg-indigo-600 rounded-t transition-colors duration-200 shadow-xs"
                ></div>
              </div>
            ))}
          </div>

          {/* Horas del eje X */}
          <div className="flex justify-between gap-3 px-2 pt-2 text-xs font-mono text-slate-500">
            {hourlyFlow.map((item, idx) => (
              <span key={idx} className="flex-1 text-center truncate">{item.hour}</span>
            ))}
          </div>
        </div>

        {/* Estado del Dispositivo ESP32 y Lector */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col justify-between">
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
                <span className="text-slate-500 font-medium">Módulo Sensor:</span>
                <span className="font-mono text-slate-800 font-semibold">RC522 (13.56 MHz)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">IP Asignada:</span>
                <span className="font-mono theme-text-primary font-semibold">{appConfig.hardware.ip}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Señal WiFi:</span>
                <span className="font-mono text-emerald-700 font-semibold">-58 dBm (Excelente)</span>
              </div>
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

          <div className="mt-6 pt-3 border-t border-slate-200 text-xs font-mono text-slate-500 flex justify-between">
            <span>Heartbeat: Activo</span>
          </div>
        </div>
      </div>

      {/* Feed inferior: Últimas lecturas */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Últimas Detecciones RFID</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentScans.map((scan) => (
            <div key={scan.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-indigo-700 font-semibold">{scan.uid}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    scan.status === 'A tiempo'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {scan.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 truncate">{scan.name}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono mt-3 pt-2 border-t border-slate-200/60">
                <span>{scan.matricula}</span>
                <span>{scan.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
