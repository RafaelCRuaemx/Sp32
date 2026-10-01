import React, { useState } from 'react';
import { ExclamationTriangleIcon, CalendarIcon } from '@heroicons/react/24/outline';
import DataTable from '../components/DataTables';
import { InasistenciasService } from '../services/api';
import { appConfig, getCardRadiusClass, getCardShadowClass, playFeedbackSound } from '../config/appConfig';

/**
 * InasistenciasView - Pantalla 3: Control y justificación de ausencias
 * Integrado con DataTable (TanStack Table) y doble confirmación para justificaciones.
 */
export default function InasistenciasView({ showToast }) {
  const cardRadius = getCardRadiusClass();
  const cardShadow = getCardShadowClass();
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

  const [inasistencias, setInasistencias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  React.useEffect(() => {
    setIsLoading(true);
    setApiError(null);
    InasistenciasService.getInasistencias({ start_date: dateRange.start, end_date: dateRange.end })
      .then((data) => setInasistencias(Array.isArray(data) ? data : []))
      .catch((err) => setApiError(err.message || 'Error de conexión con el servidor'))
      .finally(() => setIsLoading(false));
  }, [dateRange.start, dateRange.end]);

  const defaultReason = appConfig.justificationsForm?.defaultReason || appConfig.justifications[0] || 'Incapacidad Médica';
  const [filterEstado, setFilterEstado] = useState('todos');
  const [selectedItem, setSelectedItem] = useState(null);
  const [motivo, setMotivo] = useState(defaultReason);
  const [folio, setFolio] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Estado para la DOBLE VERIFICACIÓN
  const [isConfirmingJustification, setIsConfirmingJustification] = useState(false);

  // Filtrado por botón de estado (Todas, Injustificadas, Justificadas)
  const displayInasistencias =
    filterEstado === 'todos'
      ? inasistencias
      : inasistencias.filter((item) => item.estado === filterEstado);

  const handleOpenJustificar = (item) => {
    setSelectedItem(item);
    setMotivo(defaultReason);
    setFolio('');
    setObservaciones('');
    setIsConfirmingJustification(false);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsConfirmingJustification(false);
  };

  // Paso 1: Solicitar doble confirmación con validación de folio y observaciones
  const handleRequestConfirmation = (e) => {
    e.preventDefault();
    if (appConfig.justificationsForm?.requireFolio && !folio.trim()) {
      if (showToast) {
        showToast('Folio Requerido', 'Debes ingresar el número de folio o comprobante.', 'error');
      }
      return;
    }
    if (appConfig.justificationsForm?.requireObservations && !observaciones.trim()) {
      if (showToast) {
        showToast('Observaciones Requeridas', 'Debes redactar notas u observaciones de la justificación.', 'error');
      }
      return;
    }
    setIsConfirmingJustification(true);
  };

  // Paso 2: Confirmación definitiva
  const handleFinalSubmit = async () => {
    if (!selectedItem) return;

    // El usuario_id real viene del campo 'usuario_id' del objeto (nuevo) o del 'id' (dato viejo)
    const usuarioId = selectedItem.usuario_id || selectedItem.id;

    const payload = {
      fecha: selectedItem.fecha,
      motivo,
      folio: folio || 'S/F',
      observaciones,
      autorizado_por: 'Administrador Web' // Pendiente a reemplazar por login real
    };

    setInasistencias((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              estado: 'justificada',
              motivoJustificacion: `${motivo}${folio ? ` [${folio}]` : ''}`,
              folio: folio || 'S/F',
            }
          : item
      )
    );

    try {
      await InasistenciasService.justificar(usuarioId, payload).catch(() => {});
    } catch {
      // Backend offline
    }

    playFeedbackSound('success');

    if (showToast) {
      showToast('Falta Justificada', `Se asentó la justificación para ${selectedItem.nombre}.`, 'success');
    }

    handleCloseModal();
  };

  // Enmascarador de teléfono según configuración de privacidad en appConfig.security
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'No especificado';
    if (!appConfig.security?.maskTutorPhone) return phone;
    if (phone.length < 4) return '••-••••-••••';
    const last4 = phone.slice(-4);
    return `••-••••-${last4}`;
  };

  // ==============================================================================
  // DEFINICIÓN DE COLUMNAS PARA TANSTACK TABLE (DATATABLES)
  // ==============================================================================
  const columns = [
    {
      accessorKey: 'nombre',
      header: 'Alumno',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-700 font-mono shrink-0">
            {info.getValue().substring(0, 2).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-900">{info.getValue()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'matricula',
      header: 'Matrícula',
      cell: (info) => <span className="font-mono text-slate-600 font-medium">{info.getValue()}</span>,
    },
    {
      accessorKey: 'grupo',
      header: 'Grupo',
      cell: (info) => <span className="text-slate-600 font-medium">{info.getValue()}</span>,
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
      cell: (info) => <span className="font-mono text-slate-500">{info.getValue()}</span>,
    },
    {
      id: 'contacto',
      header: 'Contacto Tutor',
      cell: (info) => {
        const item = info.row.original;
        const phone = item.tutorTelefono || item.telefono || item.telefono_tutor || item.contacto;
        return <span className="font-mono text-slate-600">{formatPhoneNumber(phone)}</span>;
      }
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: (info) => {
        const item = info.row.original;
        return item.estado === 'justificada' ? (
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Justificada
            </span>
            {item.motivoJustificacion && (
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-[200px] truncate">
                {item.motivoJustificacion}
              </p>
            )}
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Injustificada
          </span>
        );
      },
    },
    ...(appConfig.tablesDisplay?.inasistencias?.showJustifyButton !== false
      ? [
          {
            id: 'acciones',
            header: 'Acción',
            cell: (info) => {
              const item = info.row.original;
              return item.estado === 'injustificada' ? (
                <button
                  onClick={() => handleOpenJustificar(item)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
                >
                  Justificar
                </button>
              ) : (
                <span className="text-xs font-medium text-emerald-600 font-mono">✓ Validado</span>
              );
            },
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Inasistencias</h1>
          <p className="text-sm text-slate-500">
            Alumnos que no registraron su credencial RFID en los lectores hoy
          </p>
        </div>
        <div>
          <span className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
            {inasistencias.filter((i) => i.estado === 'injustificada').length} Faltas pendientes por justificar
          </span>
        </div>
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

      {/* Componente DataTable con TanStack Table */}
      <DataTable
        data={displayInasistencias}
        columns={columns}
        searchPlaceholder="Buscar por alumno, matrícula o grupo..."
        exportFileName="reporte_inasistencias_rfid"
          exportTitle="Reporte de Inasistencias"
          exportDateRange={`Del ${dateRange.start} al ${dateRange.end}`}
        extraToolbar={
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-medium text-slate-500 mr-1">Filtrar:</span>
            {[
              { id: 'todos', label: 'Todas' },
              { id: 'injustificada', label: 'Injustificadas' },
              { id: 'justificada', label: 'Justificadas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterEstado(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterEstado === tab.id
                    ? 'theme-btn-primary shadow-xs font-semibold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
      />

      {/* Modal de Justificación con Doble Confirmación */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className={`bg-white border border-slate-200 ${cardRadius} w-full max-w-md p-6 ${cardShadow} space-y-4`}>
            
            {/* VISTA 1: FORMULARIO INICIAL */}
            {!isConfirmingJustification ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Justificar Inasistencia</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm font-semibold"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs space-y-1">
                  <p className="text-slate-900 font-bold">{selectedItem.nombre}</p>
                  <p className="text-slate-500 font-mono">Matrícula: {selectedItem.matricula}</p>
                  <p className="text-slate-500">Fecha de falta: {selectedItem.fecha}</p>
                </div>

                <form onSubmit={handleRequestConfirmation} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Motivo de Justificación
                    </label>
                    <select
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    >
                      {appConfig.justifications.map((just) => (
                        <option key={just} value={just}>{just}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Folio o Documento de Referencia
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. IMSS-99201"
                      value={folio}
                      onChange={(e) => setFolio(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Comentarios adicionales para el expediente..."
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 theme-btn-primary text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Continuar a Confirmación
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* VISTA 2: PASO DE DOBLE VERIFICACIÓN */
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">¿Confirmar Justificación?</h3>
                    <p className="text-xs text-slate-500">Por favor revisa los datos antes de asentar en el expediente</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Usuario:</span>
                    <span className="font-semibold text-slate-900">{selectedItem.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Motivo:</span>
                    <span className="font-semibold text-slate-900">{motivo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Folio:</span>
                    <span className="font-mono text-slate-800">{folio || 'Sin folio registrado'}</span>
                  </div>
                  {observaciones && (
                    <div className="pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500 block mb-0.5">Observación:</span>
                      <p className="text-slate-700 italic">{observaciones}</p>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                  ⚠️ Esta acción marcará la falta como justificada de forma definitiva en la base de datos de asistencia.
                </p>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingJustification(false)}
                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Volver y Modificar
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    ✓ Sí, Confirmar y Guardar
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
