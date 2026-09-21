/**
 * ==================================================================================
 * ARCHIVO DE CONFIGURACIÓN Y PERSONALIZACIÓN DEL SISTEMA (appConfig.js)
 * ==================================================================================
 * Este archivo central permite a cualquier equipo adaptar el sistema completo a su
 * gusto, colores, fuentes, maquetación (Layout) y datos escolares.
 *
 * Solo modifica los valores que necesites y guarda este archivo.
 */

export const appConfig = {
  // ================================================================================
  // 1. IDENTIDAD INSTITUCIONAL / PLANTEL ESCOLAR O NOMBRE DEL EQUIPO
  // ================================================================================
  institution: {
    name: 'Control de Asistencia RFID',          // Nombre del sistema o escuela
    shortName: 'RFID ESP32',                     // Siglas en el badge superior (ej. 'CBTIS 203', 'EQUIPO 2')
    subtitle: 'Sistema Escolar de Control de Accesos',
    cct: 'CCT: 15DIT0042K',                      // Clave de Centro de Trabajo (opcional para reportes)
    responsable: 'Ing. Coordinador de Proyecto', // Nombre del encargado / director
    copyright: '© 2026 Sistema de Asistencia RFID • Todos los derechos reservados',
  },

  // ================================================================================
  // 2. DISPOSICIÓN Y MAQUETACIÓN VISUAL (LAYOUT)
  // ================================================================================
  layout: {
    // Estilo de la navegación principal:
    // 'top'     -> Barra horizontal superior clásica
    // 'sidebar' -> Menú vertical a la izquierda estilo Dashboard Ejecutivo
    navigationStyle: 'top',

    // Configuración de la barra de navegación:
    navbar: {
      showLiveClock: true,      // ¿Mostrar u ocultar el reloj digital en vivo? (true / false)
      showHardwareBadge: true,  // ¿Mostrar u ocultar la IP del ESP32 en el Navbar? (true / false)
      tabsAlignment: 'center',  // Alineación de las pestañas: 'left' | 'center' | 'right'
    },

    // Configuración de la pantalla de Dashboard (Panel de Control):
    dashboard: {
      // Columnas para las tarjetas de métricas (KPIs): 2, 3 o 4
      kpiColumns: 4,

      // Visibilidad de widgets en el Dashboard:
      showHourlyChart: true,       // ¿Mostrar la gráfica de barras de flujo de alumnos? (true / false)
      showHardwareCard: true,      // ¿Mostrar la tarjeta de telemetría del ESP32? (true / false)
      showRecentScans: true,       // ¿Mostrar la mini-tabla de últimos accesos? (true / false)

      // Disposición de la gráfica y la tarjeta de hardware:
      // 'side-by-side' -> Lado a lado en columnas
      // 'stacked'      -> Uno debajo del otro a ancho completo
      chartLayout: 'side-by-side',
    },

    // Estilo de bordes de las tarjetas, modales y tablas:
    // 'none'    -> Bordes rectos y cuadrados (estilo técnico)
    // 'rounded' -> Redondeo suave estándar (rounded-lg)
    // 'curved'  -> Curvas modernas pronunciadas (rounded-2xl)
    cards: {
      borderRadius: 'curved',
    },
  },

  // ================================================================================
  // 3. MÓDULOS DEL SISTEMA Y NOMBRES DE PESTAÑAS
  // Permite activar/desactivar vistas o renombrar los botones del menú
  // ================================================================================
  modules: {
    dashboard: {
      enabled: true,
      label: 'Dashboard',
    },
    bitacora: {
      enabled: true,
      label: 'Registro de Asistencia',
    },
    inasistencias: {
      enabled: true,
      label: 'Inasistencias',
    },
    altas: {
      enabled: true,
      label: 'Usuarios',
    },
  },

  // ================================================================================
  // 4. PADRÓN ESCOLAR: ROLES, CARRERAS / ÁREAS Y GRUPOS
  // Modifica estas listas según las carreras y grupos de tu plantel
  // ================================================================================
  academic: {
    // Roles permitidos al crear o registrar usuarios:
    roles: ['Estudiante', 'Docente', 'Administrativo', 'Visitante'],

    // Carreras o Áreas asignadas a los usuarios:
    areas: [
      'Ing. en Sistemas Computacionales',
      'Ing. Mecatrónica',
      'Ing. Electrónica',
      'Tronco Común',
      'Administración Escolar',
      'Docencia y Laboratorios',
    ],

    // Grupos disponibles para los alumnos:
    groups: [
      '1er Semestre - Grupo A',
      '2do Semestre - Tronco Común',
      '4to - Mecatrónica',
      '6to - Sistemas A',
      '6to - Electrónica B',
    ],
  },

  // ================================================================================
  // 5. HARDWARE (LECTOR RFID Y PUNTOS DE ACCESO)
  // ================================================================================
  hardware: {
    label: 'ESP32',
    name: 'Torniquete 01 - Puerta Principal',
    ip: '192.168.1.145',
    status: 'Online',

    // Puntos de acceso o torniquetes registrados en la escuela:
    accessPoints: [
      'Torniquete 01 - Puerta Principal',
      'Torniquete 02 - Cafetería',
      'Acceso Biblioteca',
      'Laboratorio Cómputo B',
    ],
  },

  // ================================================================================
  // 6. REGLAS DE HORARIO ESCOLAR (CONTROL DE RETARDOS Y FALTAS)
  // ================================================================================
  schedule: {
    horaEntrada: '07:15',    // Hora oficial límite para llegar "A tiempo"
    horaTolerancia: '07:30', // Hora límite para "Retardo". Después de esto es "Inasistencia"
  },

  // ================================================================================
  // 7. MOTIVOS OFICIALES PARA JUSTIFICAR INASISTENCIAS
  // ================================================================================
  justifications: [
    'Incapacidad Médica IMSS / ISSEMYM',
    'Cita Médica Oficial',
    'Asunto Personal o Familiar',
    'Comisión Académica o Deportiva',
    'Trámite Administrativo Escolar',
  ],

  // ================================================================================
  // 8. PAGINACIÓN GLOBAL EN TABLAS
  // ================================================================================
  pagination: {
    itemsPerPage: 5, // Cantidad de filas mostradas por página
  },

  // ================================================================================
  // 9. TIPOGRAFÍA Y FUENTES
  // Opciones: 'sans' (moderna/limpia), 'serif' (formal/clásica), 'mono' (técnica)
  // ================================================================================
  fontFamily: 'sans',

  // ================================================================================
  // 10. TEMA VISUAL Y PALETA DE COLORES
  // Opciones: 'azul' | 'guinda' | 'verde' | 'morado' | 'slate'
  // ================================================================================
  themePreset: 'azul',

  presets: {
    slate: {
      primary: '#0f172a',
      primaryHover: '#1e293b',
      primaryText: '#ffffff',
      accent: '#334155',
      accentLight: '#f1f5f9',
      badgeBorder: '#cbd5e1',
    },
    azul: {
      primary: '#1d4ed8',
      primaryHover: '#1e40af',
      primaryText: '#ffffff',
      accent: '#2563eb',
      accentLight: '#eff6ff',
      badgeBorder: '#bfdbfe',
    },
    guinda: {
      primary: '#881337',
      primaryHover: '#700c2a',
      primaryText: '#ffffff',
      accent: '#9f1239',
      accentLight: '#fff1f2',
      badgeBorder: '#fecdd3',
    },
    verde: {
      primary: '#047857',
      primaryHover: '#065f46',
      primaryText: '#ffffff',
      accent: '#059669',
      accentLight: '#ecfdf5',
      badgeBorder: '#a7f3d0',
    },
    morado: {
      primary: '#6d28d9',
      primaryHover: '#5b21b6',
      primaryText: '#ffffff',
      accent: '#7c3aed',
      accentLight: '#f5f3ff',
      badgeBorder: '#ddd6fe',
    },
  },
};

/**
 * Función auxiliar para obtener la paleta activa
 */
export function getActiveTheme() {
  const preset = appConfig.presets[appConfig.themePreset] || appConfig.presets.azul;
  return preset;
}

/**
 * Función auxiliar para obtener la clase de redondeo de tarjetas
 */
export function getCardRadiusClass() {
  switch (appConfig.layout.cards.borderRadius) {
    case 'none':
      return 'rounded-none';
    case 'rounded':
      return 'rounded-lg';
    case 'curved':
    default:
      return 'rounded-2xl';
  }
}
