import React, { useState } from 'react';
import { BitacoraService } from '../services/api';
import Pagination from '../components/Pagination';
import { appConfig } from '../config/appConfig';

/**
 * BitacoraView - Pantalla 2: Historial en tiempo real de accesos RFID
 * Conexión lista con Django API (BitacoraService) y notificaciones Toast
 */
export default function BitacoraView({ showToast }) {
  const [logs, setLogs] = useState([
    {
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

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = appConfig.pagination.itemsPerPage;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.uid.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'todos' ? true : log.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const simularEscaneo = async () => {
    const nombresDemo = [
      { nombre: 'Gabriela Ortiz Luna', matricula: '202303102', uid: '1C:44:EE:88', estado: 'a_tiempo' },
      { nombre: 'Hector Miguel Vazquez', matricula: '202303115', uid: '6F:90:3A:42', estado: 'retardo' },
      { nombre: 'UID Desconocido', matricula: 'N/A', uid: '00:A1:B2:C3', estado: 'denegado' },
    ];
    const randomItem = nombresDemo[Math.floor(Math.random() * nombresDemo.length)];
    const nuevoLog = {
      id: Date.now(),
      nombre: randomItem.nombre,
      matricula: randomItem.matricula,
      uid: randomItem.uid,
      hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      puerta: 'Torniquete 01',
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

        <button
          onClick={simularEscaneo}
          className="flex items-center justify-center gap-2 px-4 py-2 theme-btn-primary text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Simular Lectura RFID
        </button>
      </div>

      {/* Controles de búsqueda y filtros */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Input de búsqueda */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar por nombre, matrícula o UID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
          />
        </div>

        {/* Filtros de estado */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          <span className="text-xs font-medium text-slate-500 mr-1">Estado:</span>
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'a_tiempo', label: 'A Tiempo' },
            { id: 'retardo', label: 'Retardo' },
            { id: 'denegado', label: 'Denegado' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
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
      </div>

      {/* Tabla limpia y nítida */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-mono">
              <tr>
                <th scope="col" className="px-5 py-3.5">Usuario</th>
                <th scope="col" className="px-5 py-3.5">Matrícula</th>
                <th scope="col" className="px-5 py-3.5">UID RFID</th>
                <th scope="col" className="px-5 py-3.5">Fecha y Hora</th>
                <th scope="col" className="px-5 py-3.5">Punto Acceso</th>
                <th scope="col" className="px-5 py-3.5">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap font-medium text-slate-900 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-700 font-mono">
                        {log.nombre.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{log.nombre}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap font-mono text-slate-600">
                      {log.matricula}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="font-mono text-xs px-2.5 py-1 bg-slate-100 text-indigo-900 border border-slate-200 rounded font-semibold">
                        {log.uid}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-500 font-mono">
                      {log.hora}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                      {log.puerta}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {getStatusBadge(log.estado)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-500 text-xs">
                    No se encontraron registros de accesos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredLogs.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
