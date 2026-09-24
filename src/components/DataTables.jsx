import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import {
  useLegacyTable as useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table/legacy';
import {
  appConfig,
  getCardRadiusClass,
  getTableDensityClass,
  getCardShadowClass,
} from '../config/appConfig';

/**
 * DataTables - Componente Reutilizable potenciado por TanStack Table
 * @param {Array} data - Arreglo de objetos con la información
 * @param {Array} columns - Definición de columnas de TanStack Table
 * @param {string} searchPlaceholder - Texto para el campo de búsqueda
 * @param {string} exportFileName - Nombre del archivo CSV al descargar
 * @param {React.ReactNode} extraToolbar - Botones o filtros adicionales
 */
export default function DataTable({
  data = [],
  columns = [],
  searchPlaceholder = 'Buscar...',
  exportFileName = 'reporte_asistencia',
  extraToolbar = null,
}) {
  const cardRadius = getCardRadiusClass();
  const cardShadow = getCardShadowClass();
  const tableDensity = getTableDensityClass();

  // Estados internos de TanStack Table
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: appConfig.pagination?.itemsPerPage || 5,
  });

  // Configuración de la tabla con los hooks oficiales de TanStack Table
  // oxlint-disable-next-line react/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Función para exportar los datos filtrados a archivo CSV (compatible con Excel)
  const exportarCSV = () => {
    const rows = table.getFilteredRowModel().rows;
    if (rows.length === 0) return;

    // Obtener nombres de columnas visibles
    const visibleColumns = table.getVisibleLeafColumns().filter((col) => col.id !== 'acciones');
    const headers = visibleColumns.map((col) => col.columnDef.header || col.id);
    const delimiter = appConfig.reports?.csvDelimiter || ',';

    // Obtener los datos de cada fila visible
    const csvRows = rows.map((row) =>
      visibleColumns
        .map((col) => {
          const val = row.getValue(col.id);
          const cleanVal = val === null || val === undefined ? '' : String(val).replace(/"/g, '""');
          return `"${cleanVal}"`;
        })
        .join(delimiter)
    );

    // Formatear nombre de archivo con prefijo y fecha según appConfig.reports
    const prefix = appConfig.reports?.fileNamePrefix || '';
    const dateStr = appConfig.reports?.includeTimestamp !== false ? `_${new Date().toISOString().split('T')[0]}` : '';
    const fullFileName = `${prefix}${exportFileName}${dateStr}.csv`;

    // Crear archivo descargable con codificación UTF-8 BOM para acentos en Excel
    const csvContent = '\uFEFF' + [headers.join(delimiter), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fullFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalFiltrados = table.getFilteredRowModel().rows.length;
  const startRow = totalFiltrados === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalFiltrados);

  return (
    <div className="space-y-4">
      {/* Barra de herramientas con búsqueda y exportación */}
      <div className={`flex flex-col md:flex-row gap-3 justify-between items-center bg-white border border-slate-200/90 ${cardRadius} p-3.5 shadow-xs`}>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {extraToolbar}

          {/* Botón de exportación a CSV (respetando seguridad) */}
          {appConfig.security?.allowExportCsv !== false && (
            <button
              onClick={exportarCSV}
              title="Descargar datos en archivo compatible con Excel"
              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar CSV
            </button>
          )}
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div className={`bg-white border border-slate-200/90 ${cardRadius} overflow-hidden ${cardShadow}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-mono select-none">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDirection = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        onClick={header.column.getToggleSortingHandler()}
                        className={`${tableDensity} ${canSort ? 'cursor-pointer hover:bg-slate-100/80 transition-colors' : ''}`}
                      >
                        <div className="flex items-center gap-1.5">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="text-[10px] text-slate-400 font-bold">
                              {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : '⇅'}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={tableDensity}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-10 text-center text-slate-400 text-xs">
                    No se encontraron registros coincidentes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación de TanStack Table */}
        <div className="bg-slate-50/90 px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            {appConfig.pagination?.showTotalCount !== false && (
              <span>
                Mostrando <span className="font-semibold text-slate-900">{startRow}</span> a{' '}
                <span className="font-semibold text-slate-900">{endRow}</span> de{' '}
                <span className="font-semibold text-slate-900 font-mono">{totalFiltrados}</span> registros
              </span>
            )}

            {/* Selector de Filas por Página */}
            {appConfig.pagination?.allowUserPageSize !== false && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="text-slate-500">Filas:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
                >
                  {(appConfig.pagination?.pageSizes || [5, 10, 25, 50]).map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Botones de Navegación de Página */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-medium shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>

            <span className="px-3 py-1.5 theme-btn-primary rounded-lg font-mono font-semibold shadow-xs">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-medium shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
