/**
 * ==================================================================================
 * ARCHIVO DE CONFIGURACIÓN Y PERSONALIZACIÓN DEL SISTEMA (appConfig.js)
 * ==================================================================================
 * Este archivo central es el "Centro de Mando" para cualquiera de los 5 equipos.
 * Desde aquí puedes MOVER, OCULTAR, REORDENAR Y CAMBIAR todo lo que se muestra
 * en pantalla sin tener que tocar ningún otro archivo de código.
 */

export const appConfig = {
  // ================================================================================
  // 1. IDENTIDAD INSTITUCIONAL / PLANTEL ESCOLAR O NOMBRE DEL EQUIPO
  // ================================================================================
  institution: {
    name: 'Control de Asistencia',             // Nombre del sistema o escuela
    shortName: 'RFID ESP32',                  // Siglas en el badge superior (ej. 'CBTIS 203', 'EQUIPO 2')
    subtitle: 'Control de Accesos mediante tarjetas RFID y ESP32',
    logoUrl: null,                            // Ruta de imagen de logo (ej. '/logo.png'). Si es null usa texto
    responsable: 'Ing. Coordinador de Proyecto', // Nombre del encargado / director
    cct: 'CCT: 15DIT0042K',                   // Clave de Centro de Trabajo (opcional para reportes)
    copyright: '© 2026 Sistema de Asistencia RFID • Todos los derechos reservados',
  },

  // ================================================================================
  // 2. DISPOSICIÓN Y MAQUETACIÓN VISUAL (LAYOUT)
  // ¡Aquí puedes mover y reordenar los objetos en pantalla!
  // ================================================================================
  layout: {
    // ¿DÓNDE QUIERES EL MENÚ DE NAVEGACIÓN?
    // 'top'                  -> Barra horizontal superior clásica
    // 'sidebar' o 'slidebar' -> Menú vertical lateral estilo Dashboard (izquierda o derecha)
    // 'bottom' o 'dock'      -> Barra flotante inferior estilo Dock de macOS / Móvil
    navigationStyle: 'top',

    // ¿Qué pantalla quieres que se abra por defecto al entrar al sistema?
    // Opciones: 'dashboard' | 'bitacora' | 'inasistencias' | 'altas'
    defaultView: 'dashboard',

    // ORDEN DE LAS PESTAÑAS DEL MENÚ:
    // Puedes cambiar el orden en la lista para mover las pestañas de lugar
    menuOrder: ['dashboard', 'bitacora', 'inasistencias', 'altas'],

    // Configuración de la barra horizontal (modo 'top'):
    navbar: {
      showLiveClock: true,      // ¿Mostrar u ocultar el reloj digital en vivo? (true / false)
      showHardwareBadge: true,  // ¿Mostrar u ocultar la IP del ESP32 en el Navbar? (true / false)
      tabsAlignment: 'center',  // Alineación de las pestañas en modo 'top': 'left' | 'center' | 'right'
    },

    // Configuración de la barra lateral (modo 'sidebar' o 'slidebar'):
    sidebar: {
      // 1. Posición en pantalla:
      // 'left'  -> Lado izquierdo tradicional
      // 'right' -> Lado derecho
      position: 'left',

      // 2. Comportamiento y auto-ocultamiento:
      // 'fixed'        -> Siempre visible en pantalla con su ancho completo
      // 'hover-expand' -> Mini-barra delgada de íconos que se expande completa al acercar el cursor
      // 'auto-hide'    -> Totalmente oculta en el borde; se desliza hacia afuera al acercar el cursor
      behavior: 'fixed',

      theme: 'light',           // 'light' (blanco minimalista) | 'dark' (ejecutivo oscuro) | 'brand' (color del tema)
      width: 'normal',          // 'compact' (w-56) | 'normal' (w-64) | 'wide' (w-72)
      showLogo: true,           // ¿Mostrar ícono/logo de la escuela en la cabecera? (true / false)
    },

    // CONFIGURACIÓN Y ORDEN DE ELEMENTOS EN EL DASHBOARD (PANEL DE CONTROL):
    dashboard: {
      // ORDEN DE LAS SECCIONES DEL DASHBOARD:
      // Opciones: 'kpis', 'charts', 'recentScans'
      widgetsOrder: ['recentScans', 'kpis', 'charts'],

      // Columnas para las tarjetas de métricas (KPIs): 2, 3 o 4 columnas por fila
      kpiColumns: 4,

      // Visibilidad de widgets individuales:
      showHourlyChart: true,       // ¿Mostrar la gráfica de barras de flujo? (true / false)
      showHardwareCard: true,      // ¿Mostrar la tarjeta de telemetría del ESP32? (true / false)
      showRecentScans: true,       // ¿Mostrar la mini-tabla de últimos accesos? (true / false)

      // Disposición de la gráfica y la tarjeta de hardware:
      // 'side-by-side' -> Lado a lado en columnas
      // 'stacked'      -> Uno debajo del otro a ancho completo
      chartLayout: 'side-by-side',
    },

    // POSICIÓN DE BOTONES EN LAS TABLAS:
    tables: {
      // ¿Dónde colocar el botón de acción principal ("Simular Lectura" / "Crear Usuario")?
      // 'header'  -> Arriba a la derecha junto al título de la pantalla
      // 'toolbar' -> Abajo integrado junto a la barra de búsqueda y filtros
      actionButtonPosition: 'header',
    },

    // Estilo de bordes de las tarjetas, modales y tablas:
    // 'none'    -> Bordes rectos y cuadrados (estilo técnico)
    // 'rounded' -> Redondeo suave estándar (rounded-lg)
    // 'curved'  -> Curvas modernas pronunciadas (rounded-2xl)
    cards: {
      borderRadius: 'rounded',
    },
  },

  // ================================================================================
  // 3. ESTILO DE BOTONES E INTERACTIVIDAD
  // ================================================================================
  buttons: {
    // Forma de los botones principales y secundarios:
    // 'square'  -> Rectos con esquinas en punta (rounded-none)
    // 'rounded' -> Esquinas redondeadas estándar (rounded-lg)
    // 'pill'    -> Forma de cápsula o píldora completamente redonda (rounded-full)
    borderRadius: 'rounded',

    // Elevación y sombra de botones:
    // 'flat'     -> Plano sin sombra
    // 'soft'     -> Sombra suave moderna
    // 'elevated' -> Sombra prominente
    elevation: 'elevated',
  },

  // ================================================================================
  // 4. MARCA DE AGUA DE FONDO (ESCUDO / LOGO INSTITUCIONAL)
  // ================================================================================
  watermark: {
    enabled: false,              // ¿Mostrar marca de agua en el fondo de la pantalla? (true / false)
    imageUrl: '',                // Ruta de la imagen (ej: '/logos/escudo_uam.png' o '/escudo.svg')
    opacity: 0.04,               // Nivel de opacidad tenue para no estorbar (0.02 a 0.08 recomendado)
    size: '420px',               // Tamaño del escudo (ej: '350px', '450px')
    position: 'center',          // 'center' | 'bottom-right'
  },

  // ================================================================================
  // 5. MÓDULOS DEL SISTEMA Y NOMBRES DE PESTAÑAS
  // Permite activar/desactivar vistas o renombrar los botones del menú
  // ================================================================================
  modules: {
    dashboard: {
      enabled: true,
      label: 'Estadisticcas',
    },
    bitacora: {
      enabled: true,
      label: 'Asistencia',
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
  // 6. DATOS ACADÉMICOS, ROLES Y ASIGNACIÓN DE ÁREAS
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
  // 7. HARDWARE (LECTOR RFID Y PUNTOS DE ACCESO)
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
  // 8. TELEMETRÍA Y SUPERVISIÓN DEL HARDWARE
  // ================================================================================
  telemetry: {
    autoPolling: false,          // ¿Hacer sondeo periódico automático del estado del ESP32?
    pollingIntervalMs: 5000,     // Frecuencia del ping de sondeo (en milisegundos)
    showWifiSignal: true,        // ¿Mostrar indicador de señal de red en telemetría?
    offlineAlertBanner: true,    // ¿Mostrar alerta si el lector pierde conexión?
  },

  // ================================================================================
  // 9. REGLAS DE HORARIO ESCOLAR (CONTROL DE RETARDOS Y FALTAS)
  // ================================================================================
  schedule: {
    horaEntrada: '07:15',        // Hora oficial límite para llegar "A tiempo"
    horaTolerancia: '07:30',     // Hora límite para "Retardo". Después de esto es "Inasistencia"
    toleranciaMinutos: 15,       // Tolerancia en minutos para retardo
    limiteFaltaMinutos: 30,      // Minutos a partir de los cuales se registra falta
  },

  // ================================================================================
  // 10. MOTIVOS OFICIALES PARA JUSTIFICAR INASISTENCIAS
  // ================================================================================
  justifications: [
    'Incapacidad Médica IMSS / ISSEMYM',
    'Cita Médica Oficial',
    'Asunto Personal o Familiar',
    'Comisión Académica o Deportiva',
    'Trámite Administrativo Escolar',
  ],

  // ================================================================================
  // 11. SEGURIDAD, AUDITORÍA Y PRIVACIDAD DE DATOS
  // ================================================================================
  security: {
    requireConfirmOnDelete: true,    // ¿Exigir doble confirmación antes de dar de baja a un usuario?
    requireConfirmOnJustify: true,   // ¿Exigir doble confirmación antes de asentar justificación?
    maskTutorPhone: false,           // Si es true, oculta el teléfono en pantalla (ej: 55-****-5678)
    allowExportCsv: true,            // ¿Permitir a los usuarios descargar reportes CSV?
    toastDurationMs: 3500,           // Duración en pantalla de las notificaciones toast (ms)
  },

  // ================================================================================
  // 12. CONFIGURACIÓN DE REPORTES Y DESCARGAS CSV
  // ================================================================================
  reports: {
    csvDelimiter: ',',               // ',' para formato estándar o ';' para Excel en español
    fileNamePrefix: 'REPORTE_',      // Prefijo en el nombre del archivo descargado
    includeTimestamp: true,          // ¿Incluir fecha y hora actual en el nombre del archivo?
  },

  // ================================================================================
  // 13. MODO DEMOSTRACIÓN AUTOMÁTICA (FERIA DE PROYECTOS / EXPOSICIÓN)
  // ================================================================================
  demoMode: {
    // Intervalo de escaneo automático en segundos para demostraciones:
    // 0 = Apagado (lecturas manuales con botón)
    // 5 = Simula automáticamente una lectura cada 5 segundos
    autoScanIntervalSeconds: 0,
  },

  // ================================================================================
  // 14. ALERTAS AUDITIVAS Y SONIDOS DEL LECTOR RFID
  // Generados automáticamente con síntesis de audio del navegador (sin archivos externos)
  // ================================================================================
  sounds: {
    enabled: true,                   // ¿Reproducir pitido/sonido al pasar tarjeta? (true / false)
    volume: 0.15,                    // Volumen de la alerta sonora (0.0 a 1.0)
  },

  // ================================================================================
  // 15. PAGINACIÓN GLOBAL EN TABLAS
  // ================================================================================
  pagination: {
    itemsPerPage: 5,                 // Filas mostradas por página por defecto (5, 10, 15, 20)
    allowUserPageSize: true,         // ¿Permitir al usuario cambiar el número de filas en pantalla?
    pageSizes: [5, 10, 25, 50],      // Opciones disponibles en el selector
    showTotalCount: true,            // ¿Mostrar leyenda "Mostrando X a Y de Z registros"?
    style: 'numeric',                // 'numeric' (botones 1, 2, 3...) o 'simple' (Anterior / Siguiente)
  },

  // ================================================================================
  // 16. APARIENCIA VISUAL: TAMAÑO DE LETRA, DENSIDAD Y SOMBRAS
  // ================================================================================
  appearance: {
    fontSize: 'normal',              // 'compact' (14px) | 'normal' (15px) | 'large' (17px)
    tableDensity: 'normal',          // 'compact' (ajustado) | 'normal' (estándar) | 'relaxed' (amplio)
    cardShadow: 'soft',              // 'none' (plano) | 'soft' (suave) | 'elevated' (flotante)
  },

  // ================================================================================
  // 17. TIPOGRAFÍA Y FUENTES
  // Opciones: 'sans' (moderna/limpia), 'serif' (formal/clásica), 'mono' (técnica)
  // ================================================================================
  fontFamily: 'serif',

  // ================================================================================
  // 18. TEMA VISUAL Y PALETA DE COLORES
  // Opciones: 'azul' | 'guinda' | 'verde' | 'morado' | 'slate' | 'personalizado'
  // ================================================================================
  themePreset: 'slate',

  presets: {
    // Preset para colores personalizados del manual de identidad de tu escuela:
    personalizado: {
      primary: '#002B49',            // Color primario principal (ej. Azul Marino)
      primaryHover: '#001c30',       // Color al pasar el cursor
      primaryText: '#ffffff',        // Color de texto sobre botón primario
      accent: '#D4AF37',             // Color de acento secundario (ej. Dorado)
      accentLight: '#fdfbf7',        // Fondo tenue de acento
      badgeBorder: '#f3e5ab',        // Borde de insignias
    },
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
    // Alias y temas complementarios (inglés/español) para compatibilidad total
    purple: {
      primary: '#6d28d9',
      primaryHover: '#5b21b6',
      primaryText: '#ffffff',
      accent: '#7c3aed',
      accentLight: '#f5f3ff',
      badgeBorder: '#ddd6fe',
    },
    indigo: {
      primary: '#1d4ed8',
      primaryHover: '#1e40af',
      primaryText: '#ffffff',
      accent: '#2563eb',
      accentLight: '#eff6ff',
      badgeBorder: '#bfdbfe',
    },
    emerald: {
      primary: '#047857',
      primaryHover: '#065f46',
      primaryText: '#ffffff',
      accent: '#059669',
      accentLight: '#ecfdf5',
      badgeBorder: '#a7f3d0',
    },
    rose: {
      primary: '#881337',
      primaryHover: '#700c2a',
      primaryText: '#ffffff',
      accent: '#9f1239',
      accentLight: '#fff1f2',
      badgeBorder: '#fecdd3',
    },
    sky: {
      primary: '#0284c7',
      primaryHover: '#0369a1',
      primaryText: '#ffffff',
      accent: '#38bdf8',
      accentLight: '#f0f9ff',
      badgeBorder: '#bae6fd',
    },
    amber: {
      primary: '#d97706',
      primaryHover: '#b45309',
      primaryText: '#ffffff',
      accent: '#f59e0b',
      accentLight: '#fffbeb',
      badgeBorder: '#fde68a',
    },
    custom: {
      primary: '#002B49',
      primaryHover: '#001c30',
      primaryText: '#ffffff',
      accent: '#D4AF37',
      accentLight: '#fdfbf7',
      badgeBorder: '#f3e5ab',
    },
    gris: {
      primary: '#0f172a',
      primaryHover: '#1e293b',
      primaryText: '#ffffff',
      accent: '#334155',
      accentLight: '#f1f5f9',
      badgeBorder: '#cbd5e1',
    },
  },

  // ================================================================================
  // 19. SOPORTE TÉCNICO Y CONTACTO EN PIE DE PÁGINA
  // ================================================================================
  support: {
    helpDeskPhone: 'Ext. 104 - Lab Cómputo',
    supportEmail: 'soporte.rfid@escuela.edu.mx',
    version: 'v2.1.0-prod',
  },
};

/**
 * ================================================================================
 * FUNCIONES AUXILIARES (HELPERS) DEL SISTEMA
 * ================================================================================
 */

/**
 * Obtiene la paleta de colores activa según themePreset
 */
export function getActiveTheme() {
  const presetKey = String(appConfig.themePreset || '').toLowerCase().trim();
  const preset = appConfig.presets[presetKey] || appConfig.presets[appConfig.themePreset] || appConfig.presets.morado || appConfig.presets.azul;
  return preset;
}

/**
 * Detecta si la navegación está en modo barra lateral (Sidebar)
 */
export function isSidebarLayout() {
  const style = String(appConfig.layout?.navigationStyle || '').toLowerCase().trim();
  return (
    style === 'sidebar' ||
    style === 'slidebar' ||
    style === 'lateral' ||
    style === 'vertical' ||
    style === 'left' ||
    style === 'izq' ||
    style === 'izquierda' ||
    style === 'right' ||
    style === 'der' ||
    style === 'derecha'
  );
}

/**
 * Detecta si la navegación está en modo barra flotante inferior (Bottom / Dock)
 */
export function isBottomNavLayout() {
  const style = String(appConfig.layout?.navigationStyle || '').toLowerCase().trim();
  return style === 'bottom' || style === 'dock' || style === 'inferior' || style === 'abajo';
}

/**
 * Obtiene la clase de redondeo para tarjetas y modales
 */
export function getCardRadiusClass() {
  switch (appConfig.layout?.cards?.borderRadius) {
    case 'none':
      return 'rounded-none';
    case 'rounded':
      return 'rounded-lg';
    case 'curved':
    default:
      return 'rounded-2xl';
  }
}

/**
 * Obtiene la clase de redondeo para botones
 */
export function getButtonRadiusClass() {
  switch (appConfig.buttons?.borderRadius) {
    case 'square':
      return 'rounded-none';
    case 'pill':
      return 'rounded-full';
    case 'rounded':
    default:
      return 'rounded-lg';
  }
}

/**
 * Obtiene la clase de elevación/sombra para botones
 */
export function getButtonElevationClass() {
  switch (appConfig.buttons?.elevation) {
    case 'flat':
      return 'shadow-none';
    case 'elevated':
      return 'shadow-md';
    case 'soft':
    default:
      return 'shadow-xs';
  }
}

/**
 * Obtiene las clases de estilo para el menú lateral según el tema configurado
 */
export function getSidebarClasses() {
  const theme = appConfig.layout?.sidebar?.theme || 'light';
  const width = appConfig.layout?.sidebar?.width || 'normal';
  const position = appConfig.layout?.sidebar?.position || 'left';
  const behavior = appConfig.layout?.sidebar?.behavior || 'fixed';

  const widthClass = width === 'compact' ? 'w-56' : width === 'wide' ? 'w-72' : 'w-64';
  const borderClass = position === 'right' ? 'border-l' : 'border-r';

  let themeClasses = `bg-white ${borderClass} border-slate-200/90 text-slate-800`;
  let navActiveClasses = 'theme-btn-primary shadow-xs font-semibold';
  let navInactiveClasses = 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80';
  let cardBgClasses = 'bg-slate-50 border-slate-200/80 text-slate-800';
  let headerBorderClasses = 'border-slate-100';

  if (theme === 'dark') {
    themeClasses = `bg-slate-900 ${borderClass} border-slate-800 text-slate-100`;
    navActiveClasses = 'theme-btn-primary text-white font-semibold shadow-md';
    navInactiveClasses = 'text-slate-400 hover:text-white hover:bg-slate-800/80';
    cardBgClasses = 'bg-slate-800/90 border-slate-700 text-slate-100';
    headerBorderClasses = 'border-slate-800';
  } else if (theme === 'brand') {
    themeClasses = `bg-[var(--color-primary)] ${borderClass} border-black/10 text-white`;
    navActiveClasses = 'bg-white/20 text-white font-bold backdrop-blur-xs shadow-xs';
    navInactiveClasses = 'text-white/80 hover:text-white hover:bg-white/10';
    cardBgClasses = 'bg-black/15 border-white/10 text-white';
    headerBorderClasses = 'border-white/15';
  }

  return {
    aside: `${themeClasses} h-screen sticky top-0 flex flex-col justify-between p-5 z-40 shrink-0 transition-all duration-300`,
    defaultWidth: widthClass,
    position,
    behavior,
    theme,
    themeClasses,
    navActive: navActiveClasses,
    navInactive: navInactiveClasses,
    footerCard: cardBgClasses,
    headerBorder: headerBorderClasses,
    isDarkOrBrand: theme === 'dark' || theme === 'brand',
  };
}

/**
 * Obtiene la densidad de espaciado en celdas de tablas
 */
export function getTableDensityClass() {
  switch (appConfig.appearance?.tableDensity) {
    case 'compact':
      return 'py-2 px-4';
    case 'relaxed':
      return 'py-4.5 px-6';
    case 'normal':
    default:
      return 'py-3.5 px-5';
  }
}

/**
 * Obtiene la sombra de tarjetas y paneles
 */
export function getCardShadowClass() {
  switch (appConfig.appearance?.cardShadow) {
    case 'none':
      return 'shadow-none';
    case 'elevated':
      return 'shadow-lg';
    case 'soft':
    default:
      return 'shadow-xs';
  }
}

/**
 * Reproductor de sonido sintético para alertas RFID (Web Audio API nativo del navegador)
 * No requiere descargar archivos .mp3 o .wav externos.
 * @param {'success' | 'warning' | 'error'} type
 */
export function playFeedbackSound(type = 'success') {
  if (!appConfig.sounds?.enabled || typeof window === 'undefined') return;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const vol = Math.max(0, Math.min(1, appConfig.sounds.volume || 0.15));
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      // Beep agudo agradable (880Hz -> La5)
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === 'warning') {
      // Tono medio de aviso (587Hz -> Re5)
      osc.frequency.setValueAtTime(587, ctx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'error') {
      // Zumbido grave de denegación (220Hz -> La3)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // Si el navegador bloquea audio sin interacción de usuario, ignorar silenciosamente
  }
}