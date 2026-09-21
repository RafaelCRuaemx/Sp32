/**
 * ==================================================================================
 * ARCHIVO DE CONFIGURACIÓN Y PERSONALIZACIÓN DEL SISTEMA (appConfig.js)
 * ==================================================================================
 * Este archivo central permite a cualquier equipo adaptar el sistema completo a su
 * identidad escolar, colores, fuentes y configuración de hardware sin modificar
 * código en los componentes ni en las vistas.
 *
 * Simplemente modifica los valores a continuación y guarda el archivo.
 */

export const appConfig = {
  // 1. Identidad Institucional / Nombre del Plantel o Equipo
  institution: {
    // Nombre principal mostrado en la barra de navegación y encabezados
    name: 'Control de Asistencia RFID',

    // Nombre corto o siglas para identificadores (ej: 'CBTis', 'TecNM', 'Equipo 3')
    shortName: 'RFID ESP32',

    // Subtítulo del sistema
    subtitle: 'Sistema Escolar de Control de Accesos',

    // Texto de derechos de autor en el pie de página
    copyright: '© 2026 Sistema de Asistencia RFID • Todos los derechos reservados',
  },

  // 2. Configuración de Hardware (Lector ESP32)
  hardware: {
    // Etiqueta del dispositivo
    label: 'ESP32',

    // Nombre o ubicación del lector
    name: 'Torniquete 01',

    // Dirección IP o identificador del microcontrolador
    ip: '192.168.1.145',

    // Estado del hardware ('Online' | 'Offline')
    status: 'Online',
  },

  // 3. Paginación global para todas las tablas
  pagination: {
    // Cantidad de filas mostradas por página (recomendado: 5, 8 o 10)
    itemsPerPage: 5,
  },

  // 4. Tipografía del Sistema
  // Opciones disponibles:
  // - 'sans'  : Moderna, limpia e institucional (inter / system sans)
  // - 'serif' : Tradicional, formal y elegante (georgia / serif)
  // - 'mono'  : Técnica, estilo terminal / laboratorio (menlo / monospace)
  fontFamily: 'sans',

  // 5. Tema Visual y Paleta de Colores
  // Puedes elegir uno de los temas predefinidos o personalizar los colores abajo:
  // Temas predefinidos disponibles:
  // 'slate'   -> Gris grafito neutro profesional
  // 'azul'    -> Azul universitario / tecnológico
  // 'guinda'  -> Guinda institucional / universitario clásico
  // 'verde'   -> Verde esmeralda / ecológico / mecatrónica
  // 'morado'  -> Púrpura innovación / robótica
  themePreset: 'azul',

  // Colores por tema (se aplican automáticamente según themePreset)
  presets: {
    slate: {
      primary: '#0f172a',       // slate-900
      primaryHover: '#1e293b',  // slate-800
      primaryText: '#ffffff',
      accent: '#334155',        // slate-700
      accentLight: '#f1f5f9',   // slate-100
      badgeBorder: '#cbd5e1',   // slate-300
    },
    azul: {
      primary: '#1d4ed8',       // blue-700
      primaryHover: '#1e40af',  // blue-800
      primaryText: '#ffffff',
      accent: '#2563eb',        // blue-600
      accentLight: '#eff6ff',   // blue-50
      badgeBorder: '#bfdbfe',   // blue-200
    },
    guinda: {
      primary: '#881337',       // rose-900 / vino tinto
      primaryHover: '#700c2a',  // más oscuro
      primaryText: '#ffffff',
      accent: '#9f1239',        // rose-800
      accentLight: '#fff1f2',   // rose-50
      badgeBorder: '#fecdd3',   // rose-200
    },
    verde: {
      primary: '#047857',       // emerald-700
      primaryHover: '#065f46',  // emerald-800
      primaryText: '#ffffff',
      accent: '#059669',        // emerald-600
      accentLight: '#ecfdf5',   // emerald-50
      badgeBorder: '#a7f3d0',   // emerald-200
    },
    morado: {
      primary: '#6d28d9',       // purple-700
      primaryHover: '#5b21b6',  // purple-800
      primaryText: '#ffffff',
      accent: '#7c3aed',        // purple-600
      accentLight: '#f5f3ff',   // purple-50
      badgeBorder: '#ddd6fe',   // purple-200
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

