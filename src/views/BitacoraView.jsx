import React, { useState, useEffect, useRef } from 'react';
import { BitacoraService } from '../services/api';
import DataTable from '../components/DataTables';
import { appConfig, playFeedbackSound } from '../config/appConfig';
import { PlusIcon, ArrowPathIcon, CalendarIcon } from '@heroicons/react/24/outline';

/**
 * BitacoraView - Pantalla 2: Historial en tiempo real de accesos RFID
 * Usa BitacoraService (api.js). Con appConfig.api.useMock=true usa datos demo;
 * con useMock=false se conecta al backend Django REST.
 */
export default function BitacoraView({ showToast }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('todos');

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const getLastWeekString = () => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return lastWeek.toISOString().split('T')[0];
  };

  const [dateRange, setDateRange] = useState({
    start: getLastWeekString(),
    end: getTodayString()
  });

  // Carga inicial de accesos desde la API (mock o Django)
  useEffect(() => {
    setIsLoading(true);
    setApiError(null);
    BitacoraService.getAccesos({ start_date: dateRange.start, end_date: dateRange.end })
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch((err) => setApiError(err.message || 'Error al cargar accesos'))
      .finally(() => setIsLoading(false));
  }, [dateRange.start, dateRange.end]);

  // Datos filtrados por estado para DataTable
  const displayLogs =
    statusFilter === 'todos' ? logs : logs.filter((log) => log.estado === statusFilter);

  const simularRef = useRef(null);

  const simularEscaneo = async () => {
    const nombresDemo = [
      { nombre: 'Gabriela Ortiz Luna', matricula: '202303102', uid: '1C:44:EE:88', estado: 'a_tiempo' },
      { nombre: 'Hector Miguel Vazquez', matricula: '202303115', uid: '6F:90:3A:42', estado: 'retardo' },
      { nombre: 'UID Desconocido', matricula: 'N/A', uid: '00:A1:B2:C3', estado: 'denegado' },
    ];
    const randomItem = nombresDemo[Math.floor(Math.random() * nombresDemo.length)];
    const puntos = appConfig.hardware.accessPoints || ['Torniquete 01'];
    const randomPunto = puntos[Math.floor(Math.random() * puntos.length)];

    const nuevoLog = {
      id: Date.now(),
      nombre: randomItem.nombre,
      matricula: randomItem.matricula,
      uid: randomItem.uid,
      hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      puerta: randomPunto,
      estado: randomItem.estado,
    };

    setLogs((prev) => [nuevoLog, ...prev]);

    // Reproducir alerta sonora según configuración en appConfig.sounds
    const soundType = nuevoLog.estado === 'a_tiempo' ? 'success' : nuevoLog.estado === 'retardo' ? 'warning' : 'error';
    playFeedbackSound(soundType);

    // Intento de envío a Django API si está en línea
    try {
      await BitacoraService.simularLectura({ uid: nuevoLog.uid, puerta: nuevoLog.puerta }).catch(() => {});
    } catch {
      // Ignorar fallo si el backend aún no corre
    }

    if (showToast) {
      const type = nuevoLog.estado === 'a_tiempo' ? 'success' : nuevoLog.estado === 'retardo' ? 'info' : 'error';
      showToast('Acceso Registrado (ESP32)', `${nuevoLog.nombre} • ${nuevoLog.uid} [${nuevoLog.estado.toUpperCase()}]`, type);
    }
  };

  useEffect(() => {
    simularRef.current = simularEscaneo;
  });

  // Soporte de Modo Demo Automático (feria de proyectos / exposiciones)
  const demoIntervalSeconds = appConfig.demoMode?.autoScanIntervalSeconds || 0;
  useEffect(() => {
    if (demoIntervalSeconds > 0) {
      const interval = setInterval(() => {
        if (simularRef.current) simularRef.current();
      }, demoIntervalSeconds * 1000);
      return () => clearInterval(interval);
    }
  }, [demoIntervalSeconds]);

  const getStatusBadge = (estado) => {
    const config = appConfig.statusLabels?.[estado] || {
      label: estado === 'a_tiempo' ? 'A tiempo' : estado === 'retardo' ? 'Retardo' : 'Denegado',
      color: estado === 'a_tiempo' ? 'emerald' : estado === 'retardo' ? 'amber' : 'rose',
    };

    const colorMap = {
      emerald: {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      },
      amber: {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      },
      rose: {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
      },
      red: {
        bg: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
      },
      blue: {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      },
    };

    const colorStyle = colorMap[config.color] || colorMap.emerald;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${colorStyle.bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${colorStyle.dot}`}></span>
        {config.label}
      </span>
    );
  };

  // ==============================================================================
  // DEFINICIÓN DE COLUMNAS PARA TANSTACK TABLE (DATATABLES)
  // Controlable desde appConfig.tablesDisplay.bitacora (showUidColumn, showDoorColumn)
  // ==============================================================================
  const showUid = appConfig.tablesDisplay?.bitacora?.showUidColumn !== false;
  const showDoor = appConfig.tablesDisplay?.bitacora?.showDoorColumn !== false;

  const columns = [
    {
      accessorKey: 'nombre',
      header: 'Usuario',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-700 font-mono">
            {info.getValue().substring(0, 2).toUpperCase()}
          </div>
          <span className="font-medium text-slate-900">{info.getValue()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'matricula',
      header: 'Matrícula',
      cell: (info) => <span className="font-mono text-slate-600">{info.getValue()}</span>,
    },
    ...(showUid
      ? [
          {
            accessorKey: 'uid',
            header: 'UID RFID',
            cell: (info) => (
              <span className="font-mono text-xs px-2.5 py-1 bg-slate-100 text-indigo-900 border border-slate-200 rounded font-semibold">
                {info.getValue()}
              </span>
            ),
          },
        ]
      : []),
    {
      accessorKey: 'hora',
      header: 'Fecha y Hora',
      cell: (info) => <span className="font-mono text-slate-500">{info.getValue()}</span>,
    },
    ...(showDoor
      ? [
          {
            accessorKey: 'puerta',
            header: 'Punto Acceso',
            cell: (info) => <span className="text-slate-600">{info.getValue()}</span>,
          },
        ]
      : []),
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: (info) => getStatusBadge(info.getValue()),
    },
  ];

  // Filtros rápidos configurables desde appConfig.quickFilters.bitacora
  const filterList = appConfig.quickFilters?.bitacora || ['todos', 'a_tiempo', 'retardo', 'denegado'];
  const filterLabels = {
    todos: 'Todos',
    a_tiempo: appConfig.statusLabels?.a_tiempo?.label || 'A Tiempo',
    retardo: appConfig.statusLabels?.retardo?.label || 'Retardo',
    denegado: appConfig.statusLabels?.denegado?.label || 'Denegado',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registro de Asistencia</h1>
            {demoIntervalSeconds > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                DEMO ACTIVO ({demoIntervalSeconds}s)
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Registro en tiempo real de entradas y salidas de usuarios.
          </p>
        </div>

        {appConfig.layout?.tables?.actionButtonPosition !== 'toolbar' && (
          <button
            onClick={simularEscaneo}
            className="flex items-center justify-center gap-2 px-4 py-2 theme-btn-primary text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Simular Lectura RFID
          </button>
        )}
      </div>

      {/* Controles de Filtro de Fecha */}
      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 w-fit">
        <span className="text-sm font-semibold text-slate-600 flex items-center gap-1">
          <CalendarIcon className="w-4 h-4 text-slate-500" /> Filtrar periodo:
        </span>
        <input 
          type="date" 
          value={dateRange.start}
          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          className="text-sm px-2 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-indigo-500 font-mono text-slate-700"
        />
        <span className="text-sm text-slate-400 font-medium">al</span>
        <input 
          type="date" 
          value={dateRange.end}
          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          className="text-sm px-2 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-indigo-500 font-mono text-slate-700"
        />
      </div>

      {/* Indicador de carga */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
          <ArrowPathIcon className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Cargando registros...</span>
        </div>
      )}

      {/* Mensaje de error de conexión */}
      {!isLoading && apiError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          <span className="text-lg leading-none">⚠️</span>
          <div>
            <p className="font-semibold">No se pudo conectar con el servidor</p>
            <p className="text-xs mt-0.5 text-rose-500 font-mono">{apiError}</p>
            <p className="text-xs mt-1 text-rose-600">Revisa que Django esté corriendo.</p>
          </div>
        </div>
      )}

      {/* DataTable (TanStack Table) con buscador, ordenamiento, paginación y CSV */}
      {!isLoading && !apiError && (
        <DataTable
          data={displayLogs}
          columns={columns}
          searchPlaceholder="Buscar por nombre, matrícula o UID..."
          exportFileName="bitacora_accesos_rfid"
          exportTitle="Reporte de Accesos y Asistencia"
          exportDateRange={`Del ${dateRange.start} al ${dateRange.end}`}
          extraToolbar={
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 overflow-x-auto">
                <span className="text-xs font-medium text-slate-500 mr-1">Estado:</span>
                {filterList.map((filterId) => (
                  <button
                    key={filterId}
                    onClick={() => setStatusFilter(filterId)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      statusFilter === filterId
                        ? 'theme-btn-primary shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {filterLabels[filterId] || filterId}
                  </button>
                ))}
              </div>

              {appConfig.layout?.tables?.actionButtonPosition === 'toolbar' && (
                <button
                  onClick={simularEscaneo}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 theme-btn-primary text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Simular Lectura
                </button>
              )}
            </div>
          }
        />
      )}
    </div>
  );
}
