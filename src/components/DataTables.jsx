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
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

const loadExcelJS = () => {
  return new Promise((resolve, reject) => {
    if (window.ExcelJS) return resolve(window.ExcelJS);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js';
    script.onload = () => resolve(window.ExcelJS);
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

export default function DataTable({
  data = [],
  columns = [],
  searchPlaceholder = 'Buscar...',
  exportFileName = 'reporte',
  exportTitle = 'Reporte de Datos', 
  exportDateRange = '',             
  extraToolbar = null,
}) {
  const cardRadius = getCardRadiusClass();
  const cardShadow = getCardShadowClass();
  const tableDensity = getTableDensityClass();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: appConfig.pagination?.itemsPerPage || 5,
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const confirmarExportacion = async () => {
    const rows = table.getFilteredRowModel().rows;
    const visibleColumns = table.getVisibleLeafColumns().filter((col) => col.id !== 'acciones');
    const headers = visibleColumns.map((col) => col.columnDef.header || col.id);

    const prefix = appConfig.reports?.fileNamePrefix || '';
    const dateStr = appConfig.reports?.includeTimestamp !== false ? `_${new Date().toISOString().split('T')[0]}` : '';
    const baseFileName = `${prefix}${exportFileName}${dateStr}`;

    if (exportFormat === 'excel') {
      try {
        const ExcelJS = await loadExcelJS();
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte');
        const totalCols = Math.max(visibleColumns.length, 4);

        worksheet.mergeCells(1, 1, 1, totalCols);
        const titleCell = worksheet.getCell('A1');
        titleCell.value = exportTitle;
        titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells(2, 1, 2, totalCols);
        const subtitleCell = worksheet.getCell('A2');
        subtitleCell.value = exportDateRange || 'Todos los registros (Sin filtro de fecha)';
        subtitleCell.font = { size: 11, italic: true };
        subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.addRow([]);

        if (rows.length === 0) {
          worksheet.mergeCells(4, 1, 4, totalCols);
          const emptyCell = worksheet.getCell('A4');
          emptyCell.value = exportDateRange 
            ? `No existen registros en el lapso de fechas: ${exportDateRange}` 
            : 'No existen registros para esta selección.';
          emptyCell.font = { color: { argb: 'FFDC2626' }, bold: true };
          emptyCell.alignment = { horizontal: 'center' };
        } else {
          const headerRow = worksheet.addRow(headers);
          headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
            cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            cell.alignment = { horizontal: 'center' };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          });

          rows.forEach((row) => {
            const rowData = visibleColumns.map((col) => {
              let val = row.getValue(col.id);
              const original = row.original;

              // Rescate de valores si no hay accessorKey pero existe en el objeto original
              if ((val === null || val === undefined) && original[col.id] !== undefined) {
                val = original[col.id];
              }

              // FORMATEO INTELIGENTE DE COLUMNAS PARA EL PROYECTO
              if (col.id === 'nombre' || col.id === 'Usuario' || col.id === 'Alumno') {
                val = val || original.nombre;
                // Si la matrícula no tiene columna propia pero existe, agregarla
                if (original.matricula && !visibleColumns.find(c => c.id === 'matricula')) {
                   val = `${val} (Mat: ${original.matricula})`;
                }
              }
              if (col.id === 'correo' || col.id === 'Contacto') {
                val = `${val || ''} ${original.telefono ? `(Tel: ${original.telefono})` : ''}`.trim();
              }
              if (col.id === 'uidRfid' || col.id === 'uid') {
                val = `${val || original.uidRfid || original.uid || ''} ${original.fechaAlta ? `[Alta: ${original.fechaAlta}]` : ''}`.trim();
              }
              if (col.id === 'tutorTelefono') {
                 val = val || original.tutorTelefono || 'No especificado';
              }
              if (col.id === 'estado' || col.id === 'activo') {
                const raw = String(val || original.estado || original.activo).toLowerCase();
                if (raw === 'a_tiempo') val = 'A Tiempo';
                else if (raw === 'retardo') val = 'Retardo';
                else if (raw === 'denegado') val = 'Denegado';
                else if (raw === 'justificada') val = `Justificada ${original.motivoJustificacion ? `(${original.motivoJustificacion})` : ''}`;
                else if (raw === 'injustificada') val = 'Injustificada';
                else if (raw === 'true') val = 'Activo';
                else if (raw === 'false') val = 'Inactivo';
              }

              return val === null || val === undefined ? '' : val;
            });
            const addedRow = worksheet.addRow(rowData);
            addedRow.eachCell((cell) => {
              cell.border = { 
                top: { style: 'thin', color: { argb: 'FFE2E8F0' } }, 
                bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } }, 
                left: { style: 'thin', color: { argb: 'FFE2E8F0' } }, 
                right: { style: 'thin', color: { argb: 'FFE2E8F0' } } 
              };
            });
          });

          worksheet.columns.forEach((column) => { column.width = 22; });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${baseFileName}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error exportando a Excel:", err);
        alert("Hubo un error al descargar el código de Excel. Verifica tu conexión a internet.");
      }
    } else {
      if (rows.length === 0) {
        alert("No hay datos para exportar a CSV");
        setIsExportModalOpen(false);
        return;
      }
      const delimiter = appConfig.reports?.csvDelimiter || ',';
      const csvRows = rows.map((row) =>
        visibleColumns.map((col) => {
            let val = row.getValue(col.id);
            const original = row.original;
            if ((val === null || val === undefined) && original[col.id] !== undefined) val = original[col.id];
            
            if (col.id === 'nombre' || col.id === 'Usuario' || col.id === 'Alumno') {
              val = val || original.nombre;
              if (original.matricula && !visibleColumns.find(c => c.id === 'matricula')) val = `${val} (Mat: ${original.matricula})`;
            }
            if (col.id === 'correo' || col.id === 'Contacto') val = `${val || ''} ${original.telefono ? `(Tel: ${original.telefono})` : ''}`.trim();
            if (col.id === 'uidRfid' || col.id === 'uid') val = `${val || original.uidRfid || original.uid || ''} ${original.fechaAlta ? `[Alta: ${original.fechaAlta}]` : ''}`.trim();
            if (col.id === 'tutorTelefono' || col.id === 'contacto') val = val || original.tutorTelefono || original.telefono || original.contacto || 'No especificado';
            if (col.id === 'estado' || col.id === 'activo') {
              const raw = String(val || original.estado || original.activo).toLowerCase();
              if (raw === 'a_tiempo') val = 'A Tiempo';
              else if (raw === 'retardo') val = 'Retardo';
              else if (raw === 'denegado') val = 'Denegado';
              else if (raw === 'justificada') val = `Justificada ${original.motivoJustificacion ? `(${original.motivoJustificacion})` : ''}`;
              else if (raw === 'injustificada') val = 'Injustificada';
              else if (raw === 'true') val = 'Activo';
              else if (raw === 'false') val = 'Inactivo';
            }

            const cleanVal = val === null || val === undefined ? '' : String(val).replace(/"/g, '""');
            return `"${cleanVal}"`;
        }).join(delimiter)
      );
      const csvContent = '\uFEFF' + [headers.join(delimiter), ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${baseFileName}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setIsExportModalOpen(false);
  };

  const totalFiltrados = table.getFilteredRowModel().rows.length;
  const startRow = totalFiltrados === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalFiltrados);

  return (
    <div className="space-y-4">
      <div className={`flex flex-col md:flex-row gap-3 justify-between items-center theme-card border ${cardRadius} p-3.5 shadow-xs`}>
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
          {appConfig.security?.allowExportCsv !== false && (
            <button
              onClick={() => setIsExportModalOpen(true)}
              title="Descargar datos"
              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5 text-emerald-600" />
              Exportar Datos
            </button>
          )}
        </div>
      </div>

      <div className={`theme-card border ${cardRadius} overflow-hidden ${cardShadow}`}>
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

        <div className="bg-slate-50/90 px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            {appConfig.pagination?.showTotalCount !== false && (
              <span>
                Mostrando <span className="font-semibold text-slate-900">{startRow}</span> a{' '}
                <span className="font-semibold text-slate-900">{endRow}</span> de{' '}
                <span className="font-semibold text-slate-900 font-mono">{totalFiltrados}</span> registros
              </span>
            )}
            {appConfig.pagination?.allowUserPageSize !== false && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="text-slate-500">Filas:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
                >
                  {(appConfig.pagination?.pageSizes || [5, 10, 25, 50]).map((pageSize) => (
                    <option key={pageSize} value={pageSize}>{pageSize}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
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

      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Opciones de Exportación</h3>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Formato de Archivo:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExportFormat('excel')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${exportFormat === 'excel' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    📊 Excel (.xlsx)
                  </button>
                  <button
                    onClick={() => setExportFormat('csv')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${exportFormat === 'csv' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    📄 CSV (.csv)
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                Se descargarán {totalFiltrados} registros.
              </p>
              <button
                onClick={confirmarExportacion}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Descargar Archivo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
