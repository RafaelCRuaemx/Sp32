import React, { useState } from 'react';
import { BitacoraService } from '../services/api';
// [NUEVO] Componente reutilizable DataTable potenciado por TanStack Table (ordenamiento, busqueda y CSV)
import DataTable from '../components/DataTables';
import { appConfig } from '../config/appConfig';

/**
 * BitacoraView - Pantalla 2: Historial en tiempo real de accesos RFID
 * Conexión lista con Django API (BitacoraService), TanStack Table y notificaciones Toast
 */
export default function BitacoraView({ showToast }) {
  const [logs, setLogs] = useState([
    {
      // mock de usuarios para realizar demo de como se veria el sistema
      id: 1,
      nombre: 'Valeria Morales Cruz',
      matricula: '202303001',
      uid: '9A:4B:C1:20',
      hora: '21/09/2026 07:44:12 AM',
      puerta: 'Torniquete 01',
      estado: 'retardo',
    },
    {
      id: 2,
      nombre: 'Diego Fernando Ruiz',
      matricula: '202303014',
      uid: '3D:88:5A:F2',
      hora: '21/09/2026 07:29:50 AM',
      puerta: 'Torniquete 01',
      estado: 'a_tiempo',
    },
    {
      id: 3,
      nombre: 'Sofia Elizabeth Lara',
      matricula: '202303088',
      uid: 'B1:05:44:E9',
      hora: '21/09/2026 07:28:10 AM',
      puerta: 'Torniquete 02',
      estado: 'a_tiempo',
    },
    {
      id: 4,
      nombre: 'Carlos Mendoza Rios',
      matricula: '202303045',
      uid: 'FF:20:11:09',
      hora: '21/09/2026 07:15:33 AM',
      puerta: 'Torniquete 01',
      estado: 'a_tiempo',
    },
    {
      id: 5,
      nombre: 'Tarjeta No Registrada',
      matricula: 'N/A',
      uid: 'E4:99:A0:71',
      hora: '21/09/2026 07:10:02 AM',
      puerta: 'Torniquete 01',
      estado: 'denegado',
    },
    {
      id: 6,
      nombre: 'Alejandro Ramos Benitez',
      matricula: '202303099',
      uid: '7C:12:F3:A8',
      hora: '21/09/2026 07:05:22 AM',
      puerta: 'Torniquete 02',
      estado: 'a_tiempo',
    },
    {
      id: 7,
      nombre: 'Mariana Gutierrez Vega',
      matricula: '202303032',
      uid: '5B:33:CD:19',
      hora: '21/09/2026 07:02:40 AM',
      puerta: 'Torniquete 01',
      estado: 'a_tiempo',
    },
  ]);

  // [NUEVO] Filtro de estado por botones ("Todos", "A tiempo", "Retardo", "Denegado")
  const [statusFilter, setStatusFilter] = useState('todos');

  // [NUEVO] Datos filtrados por estado para alimentar a TanStack Table
  const displayLogs =
    statusFilter === 'todos' ? logs : logs.filter((log) => log.estado === statusFilter);

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

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'a_tiempo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            A tiempo
          </span>
        );
      case 'retardo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Retardo
          </span>
        );
      case 'denegado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Denegado
          </span>
        );
      default:
        return null;
    }
  };

  // ==============================================================================
  // [NUEVO] DEFINICIÓN DE COLUMNAS PARA TANSTACK TABLE (DATATABLES)
  // Cada columna define su identificador (accessorKey), título (header) y contenido (cell)
  // ==============================================================================
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
    {
      accessorKey: 'uid',
      header: 'UID RFID',
      cell: (info) => (
        <span className="font-mono text-xs px-2.5 py-1 bg-slate-100 text-indigo-900 border border-slate-200 rounded font-semibold">
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'hora',
      header: 'Fecha y Hora',
      cell: (info) => <span className="font-mono text-slate-500">{info.getValue()}</span>,
    },
    {
      accessorKey: 'puerta',
      header: 'Punto Acceso',
      cell: (info) => <span className="text-slate-600">{info.getValue()}</span>,
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: (info) => getStatusBadge(info.getValue()),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registro de Asistencia</h1>
          <p className="text-sm text-slate-500">
            Registro en tiempo real de entradas y salidas de usuarios.
          </p>
        </div>

        {appConfig.layout?.tables?.actionButtonPosition !== 'toolbar' && (
          <button
            onClick={simularEscaneo}
            className="flex items-center justify-center gap-2 px-4 py-2 theme-btn-primary text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Simular Lectura RFID
          </button>
        )}
      </div>

      {/* ============================================================================== */}
      {/* [NUEVO] RENDERIZADO DEL COMPONENTE DATATABLE (TANSTACK TABLE)                   */}
      {/* Incluye buscador en vivo, ordenamiento por columnas (clic ▲/▼), paginación    */}
      {/* interactiva y botón de descarga a Excel/CSV.                                   */}
      {/* ============================================================================== */}
      <DataTable
        data={displayLogs}
        columns={columns}
        searchPlaceholder="Buscar por nombre, matrícula o UID..."
        exportFileName="bitacora_accesos_rfid"
        extraToolbar={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              <span className="text-xs font-medium text-slate-500 mr-1">Estado:</span>
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'a_tiempo', label: 'A Tiempo' },
                { id: 'retardo', label: 'Retardo' },
                { id: 'denegado', label: 'Denegado' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === tab.id
                      ? 'theme-btn-primary shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {appConfig.layout?.tables?.actionButtonPosition === 'toolbar' && (
              <button
                onClick={simularEscaneo}
                className="flex items-center justify-center gap-2 px-3 py-1.5 theme-btn-primary text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Simular Lectura
              </button>
            )}
          </div>
        }
      />
    </div>
  );
}
