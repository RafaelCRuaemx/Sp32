import React from 'react';
import { appConfig } from '../config/appConfig';

/**
 * Componente Reutilizable y Configurable de Paginación
 * @param {number} currentPage - Página actual
 * @param {number} totalPages - Cantidad total de páginas
 * @param {function} onPageChange - Callback para actualizar la página
 * @param {number} totalItems - Total de registros filtrados
 * @param {number} itemsPerPage - Elementos por página
 * @param {function} onPageSizeChange - Callback opcional para cambiar tamaño de página
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 5,
  onPageSizeChange,
}) {
  if (totalItems === 0) return null;

  const config = appConfig.pagination || {};
  const showTotal = config.showTotalCount !== false;
  const allowPageSize = config.allowUserPageSize !== false && Boolean(onPageSizeChange);
  const pageSizes = config.pageSizes || [5, 10, 25, 50];
  const paginationStyle = config.style || 'numeric';

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generador de números de página para estilo numérico
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-slate-50/90 px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
      {/* Información de Registros y Selector Dinámico de Filas */}
      <div className="flex flex-wrap items-center gap-3">
        {showTotal && (
          <div>
            Mostrando <span className="font-semibold text-slate-900">{startItem}</span> a{' '}
            <span className="font-semibold text-slate-900">{endItem}</span> de{' '}
            <span className="font-semibold text-slate-900 font-mono">{totalItems}</span> registros
          </div>
        )}

        {allowPageSize && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="text-slate-500">Filas:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                onPageSizeChange(newSize);
                onPageChange(1); // Reiniciar a página 1 al cambiar de tamaño
              }}
              className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Controles de Navegación de Páginas */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
          aria-label="Página anterior"
        >
          ← Anterior
        </button>

        {paginationStyle === 'numeric' ? (
          <div className="flex items-center gap-1">
            {pageNumbers.map((num, idx) => {
              const prev = pageNumbers[idx - 1];
              const showEllipsis = prev && num - prev > 1;

              return (
                <React.Fragment key={num}>
                  {showEllipsis && <span className="px-1 text-slate-400">...</span>}
                  <button
                    onClick={() => onPageChange(num)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
                      currentPage === num
                        ? 'theme-btn-primary shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-800 font-semibold shadow-xs">
            {currentPage} / {totalPages}
          </span>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
          aria-label="Página siguiente"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}