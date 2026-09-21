/**
 * ==============================================================================
 * SERVICIO CENTRALIZADO DE API (Django REST Framework + ESP32)
 * ==============================================================================
 * 
 * Este archivo define los contratos de datos y endpoints que el desarrollador
 * de Django debe implementar. Utiliza la Fetch API nativa de JavaScript.
 * 
 * Para conectar con el backend real, configura la variable en un archivo `.env`:
 * VITE_API_URL=http://127.0.0.1:8000/api
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Configuración de headers estándar para Django REST Framework
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Cliente HTTP base con manejo de respuestas y errores
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `Error HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`[API] Fallo de conexión con ${url}:`, error.message);
    throw error;
  }
}

/**
 * ------------------------------------------------------------------------------
 * ENDPOINTS DEL DASHBOARD Y TELEMETRÍA ESP32
 * ------------------------------------------------------------------------------
 */
export const DashboardService = {
  /**
   * GET /api/dashboard/resumen/
   * Retorna KPIs globales y estado del dispositivo ESP32
   * Respuesta esperada:
   * {
   *   totalPadron: 250,
   *   asistencias: 218,
   *   porcentajeAsistencia: 87.2,
   *   retardos: 19,
   *   porcentajeRetardos: 7.6,
   *   inasistencias: 13,
   *   porcentajeInasistencias: 5.2,
   *   flujoHorario: [{ hour: '07:00', count: 58, height: '65%' }, ...],
   *   esp32Status: { online: true, ip: '192.168.1.145', rssi: -58 }
   * }
   */
  getResumen: () => request('/dashboard/resumen/'),
};

/**
 * ------------------------------------------------------------------------------
 * ENDPOINTS DE REGISTRO DE ASISTENCIA (EVENTOS RFID)
 * ------------------------------------------------------------------------------
 */
export const BitacoraService = {
  /**
   * GET /api/accesos/?search=...&estado=...
   * Retorna la lista paginada o completa de registros de accesos
   * Parámetros opcionales:
   * @param {Object} params - { search: string, estado: 'a_tiempo' | 'retardo' | 'denegado' | 'todos' }
   */
  getAccesos: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.estado && params.estado !== 'todos') query.append('estado', params.estado);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/accesos/${queryString}`);
  },

  /**
   * POST /api/accesos/simular-lectura/
   * Endpoint de prueba para simular una lectura de tarjeta emitida por el ESP32
   * Payload: { uid: 'A3:4F:91:0B', puerta: 'Torniquete 01' }
   */
  simularLectura: (payload) =>
    request('/accesos/simular-lectura/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

/**
 * ------------------------------------------------------------------------------
 * ENDPOINTS DE CONTROL DE INASISTENCIAS
 * ------------------------------------------------------------------------------
 */
export const InasistenciasService = {
  /**
   * GET /api/inasistencias/?fecha=YYYY-MM-DD&search=...
   * Retorna los alumnos que no registraron su entrada en la fecha dada
   */
  getInasistencias: (fecha = null) => {
    const endpoint = fecha ? `/inasistencias/?fecha=${fecha}` : '/inasistencias/';
    return request(endpoint);
  },

  /**
   * PATCH /api/inasistencias/:id/justificar/
   * Justifica la inasistencia de un alumno
   * Payload:
   * {
   *   motivo: 'Incapacidad Médica' | 'Asunto Personal' | ...,
   *   folio: 'MED-9021',
   *   observaciones: 'Reposo indicado por 24 horas'
   * }
   */
  justificar: (id, payload) =>
    request(`/inasistencias/${id}/justificar/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};

/**
 * ------------------------------------------------------------------------------
 * ENDPOINTS DE ENROLAMIENTO Y PADRÓN DE USUARIOS RFID
 * ------------------------------------------------------------------------------
 */
export const UsuariosRfidService = {
  /**
   * GET /api/usuarios-rfid/?search=...
   * Retorna la lista de usuarios y sus credenciales vinculadas
   */
  getUsuarios: (search = '') => {
    const endpoint = search ? `/usuarios-rfid/?search=${encodeURIComponent(search)}` : '/usuarios-rfid/';
    return request(endpoint);
  },

  /**
   * POST /api/usuarios-rfid/
   * Registra un nuevo usuario y asocia su tarjeta RFID
   * Payload:
   * {
   *   nombre: 'Juan Pérez García',
   *   matricula: '202303450',
   *   rol: 'Estudiante' | 'Docente' | 'Administrativo',
   *   area: 'Ing. Sistemas',
   *   uidRfid: '9A:4B:C1:20'
   * }
   */
  registrarUsuario: (userData) =>
    request('/usuarios-rfid/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  /**
   * DELETE /api/usuarios-rfid/:id/
   * Desvincula y elimina la tarjeta RFID del padrón activo
   */
  eliminarUsuario: (id) =>
    request(`/usuarios-rfid/${id}/`, {
      method: 'DELETE',
    }),

  /**
   * GET /api/esp32/ultimo-uid-leido/
   * Permite consultar cuál fue la última tarjeta detectada por la antena del ESP32
   * Ideal para el botón "Leer ESP32" del formulario de altas
   * Respuesta esperada: { uid: '3D:88:5A:F2', timestamp: '2026-09-21T07:30:00Z' }
   */
  getUltimoUidLeido: () => request('/esp32/ultimo-uid-leido/'),
};

export default {
  Dashboard: DashboardService,
  Bitacora: BitacoraService,
  Inasistencias: InasistenciasService,
  UsuariosRfid: UsuariosRfidService,
};

