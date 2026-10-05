/**
 * ==============================================================================
 * SERVICIO CENTRALIZADO DE API (Django REST Framework + ESP32)
 * ==============================================================================
 *
 * Conecta con el servidor Django REST en la URL configurada en .env:
 * VITE_API_URL=http://127.0.0.1:8000/api
 */

import { appConfig } from '../config/appConfig';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const TIMEOUT_MS = appConfig.api?.timeoutMs ?? 8000;

// ---------------------------------------------------------------------------
// Cliente HTTP base con timeout y manejo de errores
// ---------------------------------------------------------------------------
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `Error HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`El servidor tardó más de ${TIMEOUT_MS / 1000}s en responder. Verifica que Django esté corriendo.`);
    }
    console.warn(`[API] Fallo de conexión con ${url}:`, error.message);
    throw error;
  }
}

// ===========================================================================
// DASHBOARD
// ===========================================================================
export const DashboardService = {
  /**
   * GET /api/dashboard/resumen/
   * KPIs globales del día, flujo horario y estado del ESP32.
   */
  getResumen: async () => {
    return request('/dashboard/resumen/');
  },
};

// ===========================================================================
// BITÁCORA DE ACCESOS
// ===========================================================================
export const BitacoraService = {
  getAccesos : async (filters = {}) => {
    let url = '/accesos/';
    const { start_date, end_date } = filters;
    if(start_date && end_date){
      url += `?start_date=${start_date}&end_date=${end_date}`;
    }
    return request(url);
  },
  simularLectura: async (payload) => {
    return request('/accesos/simular-lectura/',{
      method : 'POST',
      body : JSON.stringify(payload),
    });
  },
};

// ===========================================================================
// INASISTENCIAS
// ===========================================================================
export const InasistenciasService = {
  /**
   * GET /api/inasistencias/?fecha=YYYY-MM-DD
   * Alumnos sin registro de entrada en la fecha dada.
   */
  getInasistencias: async (filters = {}) => {
    let url = '/inasistencias/';
    const { start_date, end_date } = filters;
    if(start_date && end_date) {
      url += `?start_date=${start_date}&end_date=${end_date}`;
    }
    return request(url);
  },

  /**
   * PATCH /api/inasistencias/:id/justificar/
   * Justifica la inasistencia de un alumno.
   * Payload: { motivo, folio, observaciones }
   */
  justificar: async (id, data) => {
    return request(`/inasistencias/${id}/justificar/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ===========================================================================
// USUARIOS RFID (PADRÓN / ALTAS)
// ===========================================================================
export const UsuariosRfidService = {
  /**
   * GET /api/usuarios-rfid/?search=...
   * Lista de usuarios con sus credenciales RFID vinculadas.
   */
  getCatalogos: async () => {
    return request('/catalogos/');
  },
  
  getUsuarios: async (search = '') => {
    const endpoint = search ? `/usuarios-rfid/?search=${encodeURIComponent(search)}` : '/usuarios-rfid/';
    return request(endpoint);
  },

  /**
   * POST /api/usuarios-rfid/
   * Registra un nuevo usuario y asocia su tarjeta RFID.
   * Payload: { nombre, matricula, rol, area, uidRfid }
   */
  registrarUsuario: async (userData) => {
    return request('/usuarios-rfid/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },


  /**
   * PATCH /api/usuarios-rfid/:id/
   * Actualiza los datos de un usuario existente.
   */
  actualizarUsuario: async (id, userData) => {
    return request(`/usuarios-rfid/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  /**
   * DELETE /api/usuarios-rfid/:id/

   * Desvincula y elimina la tarjeta RFID del padrón.
   */
  eliminarUsuario: async (id) => {
    return request(`/usuarios-rfid/${id}/`, { method: 'DELETE' });
  },

  /**
   * GET /api/esp32/ultimo-uid-leido/
   * Consulta el último UID detectado por la antena del ESP32.
   * Respuesta: { uid: '3D:88:5A:F2', timestamp: '2026-09-21T07:30:00Z' }
   */
  getUltimoUidLeido: async () => {
    return request('/esp32/ultimo-uid-leido/');
  },
};

export default {
  Dashboard:    DashboardService,
  Bitacora:     BitacoraService,
  Inasistencias: InasistenciasService,
  UsuariosRfid:  UsuariosRfidService,
};
