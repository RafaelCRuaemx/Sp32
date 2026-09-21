import React from 'react';

/**
 * Componente Reutilizable de Paginación
 * @param {number} currentPage - Página actual
 * @param {number} totalPages - Cantidad total de páginas
 * @param {function} onPageChange - Callback para actualizar la página
 * @param {number} totalItems - Total de registros filtrados
 * @param {number} itemsPerPage - Elementos por página
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 5,
}) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-slate-50/90 px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
      <div>
        Mostrando <span className="font-semibold text-slate-900">{startItem}</span> a{' '}
        <span className="font-semibold text-slate-900">{endItem}</span> de{' '}
        <span className="font-semibold text-slate-900 font-mono">{totalItems}</span> registros
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
        >
          ← Anterior
        </button>

        <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-800 font-semibold shadow-xs">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}