import React, { useState } from 'react';
import Pagination from '../components/Pagination';
import { InasistenciasService } from '../services/api';
import { appConfig } from '../config/appConfig';

/**
 * InasistenciasView - Pantalla 3: Control y justificación de ausencias
 * Con doble confirmación para asentar justificaciones oficiales.
 */
export default function InasistenciasView({ showToast }) {
  const [inasistencias, setInasistencias] = useState([
    {
      id: 101,
      nombre: 'Mateo Hernandez Nava',
      matricula: '202303022',
      grupo: '6to - Sistemas A',
      fecha: '2026-09-21',
      estado: 'injustificada',
      motivoJustificacion: null,
      folio: null,
      tutorTelefono: '55-1234-5678',
    },
    {
      id: 102,
      nombre: 'Fernanda Castillo Montes',
      matricula: '202303057',
      grupo: '6to - Electrónica B',
      fecha: '2026-09-21',
      estado: 'injustificada',
      motivoJustificacion: null,
      folio: null,
      tutorTelefono: '55-8765-4321',
    },
    {
      id: 103,
      nombre: 'Rodrigo Albarrán Peña',
      matricula: '202303081',
      grupo: '4to - Mecatrónica',
      fecha: '2026-09-21',
      estado: 'justificada',
      motivoJustificacion: 'Cita Médica IMSS',
      folio: 'MED-9021',
      tutorTelefono: '55-3344-5566',
    },
    {
      id: 104,
      nombre: 'Andrea Paulina Salgado',
      matricula: '202303112',
      grupo: '6to - Sistemas A',
      fecha: '2026-09-21',
      estado: 'injustificada',
      motivoJustificacion: null,
      folio: null,
      tutorTelefono: '55-9988-7766',
    },
    {
      id: 105,
      nombre: 'Emiliano Zapata Godínez',
      matricula: '202303120',
      grupo: '2do - Tronco Común',
      fecha: '2026-09-21',
      estado: 'injustificada',
      motivoJustificacion: null,
      folio: null,
      tutorTelefono: '55-4422-1100',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [motivo, setMotivo] = useState('Incapacidad Médica');
  const [folio, setFolio] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Estado para la DOBLE VERIFICACIÓN
  const [isConfirmingJustification, setIsConfirmingJustification] = useState(false);

  const filteredList = inasistencias.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.grupo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = appConfig.pagination.itemsPerPage;
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedInasistencias = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenJustificar = (item) => {
    setSelectedItem(item);
    setMotivo('Incapacidad Médica');
    setFolio('');
    setObservaciones('');
    setIsConfirmingJustification(false);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsConfirmingJustification(false);
  };

  // Paso 1: Solicitar doble confirmación
  const handleRequestConfirmation = (e) => {
    e.preventDefault();
    setIsConfirmingJustification(true);
  };

  // Paso 2: Confirmación definitiva
  const handleFinalSubmit = async () => {
    if (!selectedItem) return;

    const payload = {
      motivo,
      folio: folio || 'S/F',
      observaciones,
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
      await InasistenciasService.justificar(selectedItem.id, payload).catch(() => {});
    } catch {
      // Backend offline
    }

    if (showToast) {
      showToast('Falta Justificada', `Se asentó la justificación para ${selectedItem.nombre}.`, 'success');
    }

    handleCloseModal();
  };

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

      {/* Barra de búsqueda */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Buscar por nombre, matrícula o grupo..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          TOTAL: {inasistencias.length} REGISTROS
        </span>
      </div>

      {/* Tabla de Inasistencias */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-mono">
              <tr>
                <th scope="col" className="px-5 py-3.5">Alumno / Matrícula</th>
                <th scope="col" className="px-5 py-3.5">Grupo</th>
                <th scope="col" className="px-5 py-3.5">Fecha</th>
                <th scope="col" className="px-5 py-3.5">Contacto Tutor</th>
                <th scope="col" className="px-5 py-3.5">Estado</th>
                <th scope="col" className="px-5 py-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length > 0 ? (
                paginatedInasistencias.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{item.nombre}</div>
                      <div className="text-[11px] font-mono text-slate-500">{item.matricula}</div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                      {item.grupo}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-500 font-mono">
                      {item.fecha}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-600 font-mono">
                      {item.tutorTelefono}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {item.estado === 'justificada' ? (
                        <div>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Justificada
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5 max-w-[200px] truncate">
                            {item.motivoJustificacion}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          Injustificada
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right">
                      {item.estado === 'injustificada' ? (
                        <button
                          onClick={() => handleOpenJustificar(item)}
                          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
                        >
                          Justificar
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-emerald-600">✓ Validado</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-500 text-xs">
                    No se encontraron registros de inasistencias.
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
          totalItems={filteredList.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Modal de Justificación con Doble Confirmación */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
            
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
                      <option value="Incapacidad Médica">Incapacidad Médica / Consulta</option>
                      <option value="Asunto Personal">Asunto Personal o Familiar</option>
                      <option value="Comisión Académica">Comisión Académica / Evento</option>
                      <option value="Trámite Administrativo">Trámite Administrativo</option>
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
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
