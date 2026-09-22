import React, { useState } from 'react';
import { UsuariosRfidService } from '../services/api';
import DataTable from '../components/DataTables';
import { appConfig } from '../config/appConfig';

/**
 * AltasRfidView - Pantalla 4: Gestión Integral de Usuarios y Padrón Escolar
 * Integrado con DataTable (TanStack Table) y doble verificación en altas, edición y bajas.
 */
export default function AltasRfidView({ showToast }) {
  const [usuarios, setUsuarios] = useState([
    //mock de usuarios apra realizar demo de como se veria el sistema
    {
      id: 1,
      nombre: 'Valeria Morales Cruz',
      matricula: '202303001',
      correo: 'valeria.morales@benitto.edu.mx',
      telefono: '55-1234-5678',
      rol: 'Estudiante',
      area: 'Ing. en Sistemas Computacionales',
      uidRfid: '9A:4B:C1:20',
      fechaAlta: '2026-09-01',
      activo: true,
    },
    {
      id: 2,
      nombre: 'Diego Fernando Ruiz',
      matricula: '202303014',
      correo: 'diego.ruiz@benitto.edu.mx',
      telefono: '55-2345-6789',
      rol: 'Estudiante',
      area: 'Ing. Mecatrónica',
      uidRfid: '3D:88:5A:F2',
      fechaAlta: '2026-09-01',
      activo: true,
    },
    {
      id: 3,
      nombre: 'Ing. Roberto Mendoza Peña',
      matricula: 'DOC-8820',
      correo: 'roberto.mendoza@benitto.edu.mx',
      telefono: '55-8899-0011',
      rol: 'Docente',
      area: 'Docencia y Laboratorios',
      uidRfid: 'FF:20:11:09',
      fechaAlta: '2026-08-15',
      activo: true,
    },
    {
      id: 4,
      nombre: 'Sofia Elizabeth Lara',
      matricula: '202303088',
      correo: 'sofia.lara@benitto.edu.mx',
      telefono: '55-3456-7890',
      rol: 'Estudiante',
      area: 'Ing. Electrónica',
      uidRfid: 'B1:05:44:E9',
      fechaAlta: '2026-09-02',
      activo: true,
    },
    {
      id: 5,
      nombre: 'Lic. Claudia Nava Sánchez',
      matricula: 'ADM-4012',
      correo: 'claudia.nava@benitto.edu.mx',
      telefono: '55-7766-5544',
      rol: 'Administrativo',
      area: 'Administración Escolar',
      uidRfid: '7C:12:F3:A8',
      fechaAlta: '2026-08-10',
      activo: true,
    },
    {
      id: 6,
      nombre: 'Mariana Gutierrez Vega',
      matricula: '202303032',
      correo: 'mariana.gutierrez@benitto.edu.mx',
      telefono: '55-4567-8901',
      rol: 'Estudiante',
      area: 'Ing. en Sistemas Computacionales',
      uidRfid: '5B:33:CD:19',
      fechaAlta: '2026-09-03',
      activo: true,
    },
  ]);

  // Control de Modal y Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  // Estados de DOBLE VERIFICACIÓN
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [pendingUidOverwrite, setPendingUidOverwrite] = useState(null);

  const initialFormState = {
    nombre: '',
    matricula: '',
    correo: '',
    telefono: '',
    rol: appConfig.academic.roles[0] || 'Estudiante',
    area: appConfig.academic.areas[0] || '',
    uidRfid: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [rolFilter, setRolFilter] = useState('todos');

  const handleOpenCreateModal = () => {
    setEditingUserId(null);
    setFormData(initialFormState);
    setIsConfirmingSave(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (usuario) => {
    setEditingUserId(usuario.id);
    setFormData({
      nombre: usuario.nombre,
      matricula: usuario.matricula,
      correo: usuario.correo,
      telefono: usuario.telefono,
      rol: usuario.rol,
      area: usuario.area,
      uidRfid: usuario.uidRfid,
    });
    setIsConfirmingSave(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setIsConfirmingSave(false);
    setFormData(initialFormState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // DOBLE VERIFICACIÓN EN "LEER ESP32"
  const simularCapturaUidEsp32 = () => {
    const hex = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .toUpperCase()
        .padStart(2, '0')
    ).join(':');

    // Si ya existe un UID previo, pedir confirmación antes de sobrescribir
    if (formData.uidRfid && formData.uidRfid.trim() !== '') {
      setPendingUidOverwrite(hex);
    } else {
      setFormData((prev) => ({ ...prev, uidRfid: hex }));
      if (showToast) {
        showToast('Lectura ESP32 Detectada', `Tag RFID capturado: ${hex}`, 'info');
      }
    }
  };

  const handleConfirmOverwriteUid = () => {
    if (pendingUidOverwrite) {
      setFormData((prev) => ({ ...prev, uidRfid: pendingUidOverwrite }));
      if (showToast) {
        showToast('Tarjeta Reemplazada', `Nuevo UID asignado: ${pendingUidOverwrite}`, 'info');
      }
    }
    setPendingUidOverwrite(null);
  };

  // PASO 1 DE GUARDADO: Validación y apertura de confirmación
  const handleRequestSaveConfirmation = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.matricula.trim() || !formData.uidRfid.trim()) {
      if (showToast) {
        showToast('Campos Incompletos', 'Completa el nombre, matrícula y UID de la tarjeta.', 'error');
      }
      return;
    }
    setIsConfirmingSave(true);
  };

  // PASO 2 DE GUARDADO: Confirmación final
  const handleFinalSubmit = async () => {
    if (editingUserId) {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === editingUserId
            ? {
                ...u,
                nombre: formData.nombre.trim(),
                matricula: formData.matricula.trim().toUpperCase(),
                correo: formData.correo.trim() || `${formData.matricula.toLowerCase()}@benitto.edu.mx`,
                telefono: formData.telefono.trim() || 'No especificado',
                rol: formData.rol,
                area: formData.area.trim() || 'General',
                uidRfid: formData.uidRfid.trim().toUpperCase(),
              }
            : u
        )
      );

      if (showToast) {
        showToast('Usuario Actualizado', `Los datos de ${formData.nombre} fueron guardados.`, 'success');
      }
    } else {
      const nuevoUsuario = {
        id: Date.now(),
        nombre: formData.nombre.trim(),
        matricula: formData.matricula.trim().toUpperCase(),
        correo: formData.correo.trim() || `${formData.matricula.toLowerCase()}@benitto.edu.mx`,
        telefono: formData.telefono.trim() || 'No especificado',
        rol: formData.rol,
        area: formData.area.trim() || 'General',
        uidRfid: formData.uidRfid.trim().toUpperCase(),
        fechaAlta: new Date().toISOString().split('T')[0],
        activo: true,
      };

      setUsuarios((prev) => [nuevoUsuario, ...prev]);

      try {
        await UsuariosRfidService.registrarUsuario(nuevoUsuario).catch(() => {});
      } catch {
        // Backend offline
      }

      if (showToast) {
        showToast('Usuario Registrado', `${nuevoUsuario.nombre} ha sido dado de alta exitosamente.`, 'success');
      }
    }

    handleCloseModal();
  };

  // DOBLE VERIFICACIÓN EN ELIMINAR USUARIO
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setUsuarios((prev) => prev.filter((u) => u.id !== userToDelete.id));

    try {
      await UsuariosRfidService.eliminarUsuario(userToDelete.id).catch(() => {});
    } catch {
      // Backend offline
    }

    if (showToast) {
      showToast('Usuario Eliminado', `${userToDelete.nombre} y su tarjeta han sido dados de baja.`, 'info');
    }

    setUserToDelete(null);
  };

  const getRolBadge = (rol) => {
    switch (rol) {
      case 'Estudiante':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Docente':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Administrativo':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  // Filtrado de usuarios por Rol (Todos, Estudiante, Docente, etc.)
  const displayUsuarios =
    rolFilter === 'todos' ? usuarios : usuarios.filter((u) => u.rol === rolFilter);

  // ==============================================================================
  // DEFINICIÓN DE COLUMNAS PARA TANSTACK TABLE (DATATABLES)
  // ==============================================================================
  const columns = [
    {
      accessorKey: 'nombre',
      header: 'Usuario',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-700 font-mono shrink-0">
            {info.getValue().substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{info.getValue()}</p>
            <span className="font-mono text-[11px] text-slate-500">ID: {info.row.original.matricula}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'rol',
      header: 'Rol y Carrera / Área',
      cell: (info) => (
        <div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getRolBadge(info.getValue())}`}>
            {info.getValue()}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">{info.row.original.area}</p>
        </div>
      ),
    },
    {
      accessorKey: 'correo',
      header: 'Contacto',
      cell: (info) => (
        <div className="font-mono text-[11px]">
          <p className="text-slate-700">{info.getValue()}</p>
          <p className="text-slate-400">{info.row.original.telefono}</p>
        </div>
      ),
    },
    {
      accessorKey: 'uidRfid',
      header: 'Credencial RFID (ESP32)',
      cell: (info) => (
        <div>
          <span className="font-mono text-xs px-2.5 py-1 bg-slate-100 text-indigo-900 border border-slate-200 rounded font-semibold">
            {info.getValue()}
          </span>
          <span className="text-[10px] text-slate-400 block font-mono mt-1">Alta: {info.row.original.fechaAlta}</span>
        </div>
      ),
    },
    {
      accessorKey: 'activo',
      header: 'Estado',
      cell: (info) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          {info.getValue() ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: (info) => {
        const u = info.row.original;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => handleOpenEditModal(u)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
            <button
              onClick={() => setUserToDelete(u)}
              title="Eliminar usuario (con confirmación)"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-sm text-slate-500">
            Padrón escolar institucional: consulta, alta y edición de perfiles con tarjeta RFID
          </p>
        </div>

        {appConfig.layout?.tables?.actionButtonPosition !== 'toolbar' && (
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 theme-btn-primary text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Crear Usuario
          </button>
        )}
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Total Usuarios</span>
          <span className="text-2xl font-bold text-slate-900 font-mono mt-0.5 block">{usuarios.length}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Estudiantes</span>
          <span className="text-2xl font-bold text-indigo-600 font-mono mt-0.5 block">
            {usuarios.filter((u) => u.rol === 'Estudiante').length}
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Docentes</span>
          <span className="text-2xl font-bold text-purple-600 font-mono mt-0.5 block">
            {usuarios.filter((u) => u.rol === 'Docente').length}
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">RFID Asignadas</span>
          <span className="text-2xl font-bold text-emerald-600 font-mono mt-0.5 block">{usuarios.length}</span>
        </div>
      </div>

      {/* Componente DataTable con TanStack Table */}
      <DataTable
        data={displayUsuarios}
        columns={columns}
        searchPlaceholder="Buscar por nombre, matrícula, correo o UID..."
        exportFileName="padron_usuarios_rfid"
        extraToolbar={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-medium text-slate-500 mr-1">Filtrar:</span>
              {['todos', ...appConfig.academic.roles].map((rol) => (
                <button
                  key={rol}
                  onClick={() => setRolFilter(rol)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer capitalize whitespace-nowrap ${
                    rolFilter === rol
                      ? 'theme-btn-primary shadow-xs font-semibold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {rol === 'todos' ? 'Todos los roles' : rol}
                </button>
              ))}
            </div>

            {appConfig.layout?.tables?.actionButtonPosition === 'toolbar' && (
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 theme-btn-primary text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Crear Usuario
              </button>
            )}
          </div>
        }
      />

      {/* =========================================================================
          MODAL 1: FORMULARIO CREAR / EDITAR USUARIO (CON DOBLE VERIFICACIÓN)
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            {/* PASO 1: FORMULARIO */}
            {!isConfirmingSave ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {editingUserId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {editingUserId ? 'Actualiza los datos o reasigna la tarjeta RFID' : 'Ingresa la información personal y asigna la tarjeta RFID'}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm font-semibold p-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleRequestSaveConfirmation} noValidate className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre Completo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Juan Pérez García"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Matrícula / Identificador <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="matricula"
                        required
                        value={formData.matricula}
                        onChange={handleChange}
                        placeholder="202303450"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 font-mono uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rol</label>
                      <select
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                      >
                        {appConfig.academic.roles.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Institucional</label>
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        placeholder="usuario@escuela.edu.mx"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                      <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="55-1234-5678"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Carrera / Área Académica</label>
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    >
                      {appConfig.academic.areas.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  {/* Campo UID con botón ESP32 */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-800">
                      Tarjeta RFID Asignada (UID) <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="uidRfid"
                        required
                        value={formData.uidRfid}
                        onChange={handleChange}
                        placeholder="00:00:00:00"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 font-mono tracking-wider font-semibold"
                      />
                      <button
                        type="button"
                        onClick={simularCapturaUidEsp32}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-mono rounded-lg border border-slate-300 transition-colors whitespace-nowrap cursor-pointer font-medium"
                      >
                        📡 Leer ESP32
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Acerca la tarjeta al sensor o presiona "Leer ESP32".
                    </p>
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
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Continuar a Confirmación
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* PASO 2: DOBLE VERIFICACIÓN DE GUARDADO */
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {editingUserId ? '¿Confirmar Modificación?' : '¿Confirmar Alta de Usuario?'}
                    </h3>
                    <p className="text-xs text-slate-500">Revisa la información antes de guardar en la base de datos</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nombre:</span>
                    <span className="font-semibold text-slate-900">{formData.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Matrícula / ID:</span>
                    <span className="font-mono font-semibold text-slate-800">{formData.matricula}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rol:</span>
                    <span className="font-medium text-slate-800">{formData.rol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Área:</span>
                    <span className="text-slate-700">{formData.area || 'General'}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Tarjeta RFID UID:</span>
                    <span className="font-mono font-bold text-indigo-700">{formData.uidRfid}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 bg-slate-100 border border-slate-200 rounded-lg p-2.5">
                  ℹ️ Esta tarjeta RFID quedará habilitada para registrar entradas en el torniquete ESP32 inmediatamente.
                </p>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingSave(false)}
                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Volver y Modificar
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    {editingUserId ? '✓ Sí, Guardar Cambios' : '✓ Sí, Confirmar y Registrar'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: DOBLE VERIFICACIÓN DE ELIMINACIÓN DE USUARIO (PAPELERA)
          ========================================================================= */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">¿Dar de baja a este usuario?</h3>
                <p className="text-xs text-slate-500">Confirmación de eliminación irreversible</p>
              </div>
            </div>

            <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-3.5 text-xs text-rose-900 space-y-1">
              <p>Estás a punto de eliminar a: <strong>{userToDelete.nombre}</strong></p>
              <p className="font-mono text-[11px]">Matrícula: {userToDelete.matricula} • Rol: {userToDelete.rol}</p>
              <p className="font-mono text-[11px]">Tarjeta RFID vinculada: {userToDelete.uidRfid}</p>
            </div>

            <p className="text-xs text-slate-600">
              Al confirmar, el usuario será retirado del registro y su tarjeta RFID dejará de tener acceso autorizado. Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Sí, Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: DOBLE VERIFICACIÓN DE SOBRESCRITURA DE TARJETA ("LEER ESP32")
          ========================================================================= */}
      {pendingUidOverwrite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="text-xl">📡</span>
              <h4 className="text-sm font-bold text-slate-900">¿Reemplazar UID Asignado?</h4>
            </div>

            <p className="text-xs text-slate-600">
              El campo ya tiene una tarjeta asignada (<code className="font-mono font-bold text-slate-800">{formData.uidRfid}</code>).
            </p>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
              Nueva lectura detectada: <strong className="text-indigo-600">{pendingUidOverwrite}</strong>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPendingUidOverwrite(null)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Mantener Actual
              </button>
              <button
                type="button"
                onClick={handleConfirmOverwriteUid}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Reemplazar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
