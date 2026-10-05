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
    navigationStyle: 'dock',  // 'top', | 'sidebar', | 'slidebar', | 'bottom', | 'dock',

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
      position: 'right',

      // 2. Comportamiento y auto-ocultamiento:
      // 'fixed'        -> Siempre visible en pantalla con su ancho completo
      // 'hover-expand' -> Mini-barra delgada de íconos que se expande completa al acercar el cursor
      // 'auto-hide'    -> Totalmente oculta en el borde; se desliza hacia afuera al acercar el cursor
      behavior: 'hover-expand',

      theme: 'brand',           // 'light' (blanco minimalista) | 'dark' (ejecutivo oscuro) | 'brand' (color del tema)
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
      chartLayout: 'stacked',

      // CONFIGURACIÓN Y ESTILO VISUAL DE LA GRÁFICA:
      chart: {
        // Tipo de gráfica:
        // 'donut'           -> Anillo circular de porcentajes (Asistencias / Retardos / Faltas)
        // 'gauge'           -> Velocímetro / Arco de cumplimiento de meta escolar
        // 'area'            -> Curva continua de área SVG fluida (estilo Stripe / Vercel)
        // 'horizontal-bars' -> Tráfico por torniquete y punto de acceso
        // 'step'            -> Línea escalonada de aforo acumulado
        // 'gradient-bars'   -> Barras modernas con degradado vertical
        // 'bars'            -> Barras verticales tradicionales
        type: 'donut',

        // Paleta de color:
        // 'theme'    -> Sincronizado automáticamente con el color institucional activo
        // 'gradient' -> Degradado moderno entre el color primario y el de acento
        // 'emerald'  -> Verde esmeralda fresco
        // 'sky'      -> Azul cielo tecnológico
        // 'amber'    -> Dorado / Ámbar energético
        // 'rose'     -> Rosa / Guinda
        // 'slate'    -> Gris grafito elegante
        color: 'theme',

        // Forma de las puntas en las barras (solo para 'bars' o 'gradient-bars'):
        // 'rounded' -> Redondeado suave superior (8px)
        // 'pill'    -> Forma de cápsula / píldora completa
        // 'square'  -> Recto plano
        barShape: 'rounded',

        // ¿Mostrar línea guía horizontal con el promedio de accesos por hora?
        showAverageLine: true,

        // ¿Mostrar badge en la esquina superior con el pico máximo de aforo?
        showPeakBadge: true,
      },
    },

    // POSICIÓN DE BOTONES EN LAS TABLAS:
    tables: {
      // ¿Dónde colocar el botón de acción principal ("Simular Lectura" / "Crear Usuario")?
      // 'header'  -> Arriba a la derecha junto al título de la pantalla
      // 'toolbar' -> Abajo integrado junto a la barra de búsqueda y filtros
      actionButtonPosition: 'header',
    },

    // Estilo de bordes y apariencia de las tarjetas, modales y tablas:
    // borderRadius: 'none' (recto) | 'rounded' (suave) | 'curved' (pronunciado)
    cards: {
      borderRadius: 'rounded',
      
      // ESTILO Y COLOR DE LAS TARJETAS:
      // 'theme-border' -> (Recomendado) Interior blanco puro con borde iluminado al color del tema
      // 'white'        -> Clásico blanco con bordes neutros de pizarra (slate)
      // 'tinted'       -> Fondo suavemente entintado con el tono tenue del tema
      // 'glass'        -> Efecto moderno de cristal translúcido con desenfoque de fondo
      style: 'tinted',
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
      label: 'Estadisticas',
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
    // Configuración de Acceso y 2FA (Google Authenticator)
    auth: {
      requireLogin: true,            // Cambia a true para activar la pantalla de login, o false para bypass
      enable2FA: true,               // ¿Solicitar los 6 dígitos de Google Authenticator?
      mockMode: false,                // true = modo prueba en navegador; false = conecta con Django
      issuerName: 'Control Escolar RFID',
    },
  },

  // ================================================================================
  // 11.5 CONEXIÓN CON EL BACKEND (API DJANGO)
  // ================================================================================
  // ┌─────────────────────────────────────────────────────────────────────────────┐
  // │  useMock: true   → El sistema usa datos de demostración internos.           │
  // │                    Funciona sin Django, ideal para desarrollo del frontend.  │
  // │                                                                             │
  // │  useMock: false  → El sistema consulta el servidor Django REST.             │
  // │                    Requiere que Django esté corriendo y la URL configurada   │
  // │                    en el archivo .env (VITE_API_URL=http://127.0.0.1:8000/api)│
  // └─────────────────────────────────────────────────────────────────────────────┘
  api: {
    useMock: false,   // ← CAMBIA A false CUANDO DJANGO ESTÉ LISTO

    // Tiempo máximo de espera para respuestas del servidor (ms)
    // Si Django tarda más que esto, se mostrará un error de conexión.
    timeoutMs: 8000,

    // ¿Mostrar un indicador de "Cargando..." mientras se consulta Django?
    showLoadingSpinner: true,

    // ¿Reintentar automáticamente si falla la conexión?
    retryOnError: false,
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
    cardShadow: 'elevated',              // 'none' (plano) | 'soft' (suave) | 'elevated' (flotante)

    // COLOR O MODO DE FONDO GENERAL DE LA APLICACIÓN:
    // 'slate'      -> Fondo gris suave ejecutivo (#f8fafc) [Estándar recomendado para contraste]
    // 'tinted'     -> Fondo suavemente entintado con el color del tema activo (ej: lila tenue si es morado)
    // 'pure-white' -> Fondo blanco puro (#ffffff)
    // 'zinc'       -> Fondo gris neutro cálido (#f4f4f5)
    // '#f4f6f9'    -> O cualquier código hexadecimal específico de tu colegio
    backgroundMode: 'tinted',
  },

  // ================================================================================
  // 17. TIPOGRAFÍA Y FUENTES
  // Opciones disponibles: 'outfit' | 'inter' | 'poppins' | 'jakarta' | 'roboto' | 'sans' | 'serif' | 'mono'
  // Puedes cambiar fontFamily por cualquiera de las llaves definidas en fontPresets abajo:
  // ================================================================================
  fontFamily: 'sans',

  fontPresets: {
    outfit: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    poppins: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    jakarta: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    roboto: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    serif: "Georgia, Cambria, 'Times New Roman', Times, serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },

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
      accentLight: '#fef3c7',        // Fondo armónico tenue de acento (Ámbar suave visible)
      badgeBorder: '#fcd34d',        // Borde de insignias
    },
    slate: {
      primary: '#0f172a',
      primaryHover: '#1e293b',
      primaryText: '#ffffff',
      accent: '#334155',
      accentLight: '#e2e8f0',        // Fondo gris pizarra ejecutivo distinguible
      badgeBorder: '#cbd5e1',
    },
    azul: {
      primary: '#1d4ed8',
      primaryHover: '#1e40af',
      primaryText: '#ffffff',
      accent: '#2563eb',
      accentLight: '#dbeafe',        // Fondo azul cielo suave distinguible
      badgeBorder: '#93c5fd',
    },
    guinda: {
      primary: '#881337',
      primaryHover: '#700c2a',
      primaryText: '#ffffff',
      accent: '#9f1239',
      accentLight: '#ffe4e6',        // Fondo vino/rosa tenue distinguible
      badgeBorder: '#fda4af',
    },
    verde: {
      primary: '#047857',
      primaryHover: '#065f46',
      primaryText: '#ffffff',
      accent: '#059669',
      accentLight: '#d1fae5',        // Fondo menta suave distinguible
      badgeBorder: '#6ee7b7',
    },
    morado: {
      primary: '#6d28d9',
      primaryHover: '#5b21b6',
      primaryText: '#ffffff',
      accent: '#7c3aed',
      accentLight: '#ede9fe',        // Fondo lavanda/lila suave distinguible
      badgeBorder: '#c4b5fd',
    },
    // Alias y temas complementarios (inglés/español) para compatibilidad total
    purple: {
      primary: '#6d28d9',
      primaryHover: '#5b21b6',
      primaryText: '#ffffff',
      accent: '#7c3aed',
      accentLight: '#ede9fe',
      badgeBorder: '#c4b5fd',
    },
    indigo: {
      primary: '#1d4ed8',
      primaryHover: '#1e40af',
      primaryText: '#ffffff',
      accent: '#2563eb',
      accentLight: '#dbeafe',
      badgeBorder: '#93c5fd',
    },
    emerald: {
      primary: '#047857',
      primaryHover: '#065f46',
      primaryText: '#ffffff',
      accent: '#059669',
      accentLight: '#d1fae5',
      badgeBorder: '#6ee7b7',
    },
    rose: {
      primary: '#881337',
      primaryHover: '#700c2a',
      primaryText: '#ffffff',
      accent: '#9f1239',
      accentLight: '#ffe4e6',
      badgeBorder: '#fda4af',
    },
    sky: {
      primary: '#0284c7',
      primaryHover: '#0369a1',
      primaryText: '#ffffff',
      accent: '#38bdf8',
      accentLight: '#e0f2fe',
      badgeBorder: '#7dd3fc',
    },
    amber: {
      primary: '#d97706',
      primaryHover: '#b45309',
      primaryText: '#ffffff',
      accent: '#f59e0b',
      accentLight: '#fef3c7',
      badgeBorder: '#fcd34d',
    },
    custom: {
      primary: '#002B49',
      primaryHover: '#001c30',
      primaryText: '#ffffff',
      accent: '#D4AF37',
      accentLight: '#fef3c7',
      badgeBorder: '#fcd34d',
    },
    gris: {
      primary: '#0f172a',
      primaryHover: '#1e293b',
      primaryText: '#ffffff',
      accent: '#334155',
      accentLight: '#e2e8f0',
      badgeBorder: '#cbd5e1',
    },
  },

  // ================================================================================
  // 19. ETIQUETAS Y BADGES DE ESTADOS DE ASISTENCIA
  // Permite renombrar y cambiar el color de los estados en Bitácora y Dashboard
  // Colores soportados: 'emerald' | 'amber' | 'rose' | 'red' | 'blue'
  // ================================================================================
  statusLabels: {
    a_tiempo: { label: 'A tiempo', color: 'emerald' },
    retardo:  { label: 'Retardo', color: 'amber' },
    denegado: { label: 'Denegado', color: 'rose' },
    falta:    { label: 'Inasistencia', color: 'red' },
  },

  // ================================================================================
  // 20. VISIBILIDAD DE COLUMNAS EN TABLAS (MOSTRAR / OCULTAR DATOS TÉCNICOS)
  // ================================================================================
  tablesDisplay: {
    bitacora: {
      showUidColumn: true,       // ¿Mostrar la columna con el código hexadecimal UID RFID?
      showDoorColumn: true,      // ¿Mostrar el punto de acceso / torniquete por el que entró?
    },
    altas: {
      showPhoneColumn: true,     // ¿Mostrar la columna de teléfono del tutor?
      showEmailColumn: true,     // ¿Mostrar la columna de correo institucional?
      showDateColumn: true,      // ¿Mostrar la fecha de registro en la tarjeta?
    },
    inasistencias: {
      showJustifyButton: true,   // ¿Permitir el botón de justificar a los usuarios?
    },
  },

  // ================================================================================
  // 21. REGLAS DEL FORMULARIO DE REGISTRO DE USUARIOS (ALTAS)
  // ================================================================================
  userRegistration: {
    requireEmail: false,         // ¿El correo es obligatorio para guardar? (false = opcional)
    requirePhone: true,          // ¿El teléfono es obligatorio para guardar?
    defaultRole: 'Estudiante',   // Rol preseleccionado ('Estudiante', 'Docente', 'Administrativo')
    autoUppercaseName: false,     // Convierte automáticamente el nombre a MAYÚSCULAS
  },

  // ================================================================================
  // 22. TURNOS Y METAS DEL DASHBOARD
  // ================================================================================
  dashboardSchedule: {
    activeShift: 'matutino',     // 'matutino' | 'vespertino'
    targetAttendancePercentage: 85, // % mínimo esperado (bajo este nivel, el KPI avisa en ámbar/rojo)
  },

  // ================================================================================
  // 23. BOTONES DE FILTRO RÁPIDO EN TABLAS
  // Define qué botones aparecen arriba de cada tabla para filtrar registros con un solo clic
  // ================================================================================
  quickFilters: {
    bitacora: ['todos', 'a_tiempo', 'retardo', 'denegado'],
    altas: ['todos', 'Estudiante', 'Docente', 'Administrativo'],
  },

  // ================================================================================
  // 24. REGLAS DEL FORMULARIO DE JUSTIFICACIÓN DE FALTAS
  // ================================================================================
  justificationsForm: {
    requireFolio: true,          // ¿Exigir número de folio o receta médica?
    requireObservations: false,  // ¿Exigir redactar notas u observaciones?
    defaultReason: 'Incapacidad Médica IMSS / ISSSTE', // Razón preseleccionada
  },

  // ================================================================================
  // 25. SOPORTE TÉCNICO Y CONTACTO EN PIE DE PÁGINA
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
 * Obtiene las clases de fondo y borde para las tarjetas según layout.cards.style
 */
export function getCardThemeClasses() {
  const style = String(appConfig.layout?.cards?.style || 'theme-border').toLowerCase().trim();

  switch (style) {
    case 'tinted':
      return 'bg-[var(--color-accent-light,#f8fafc)] border border-[var(--color-badge-border,#cbd5e1)]';
    case 'glass':
      return 'bg-white/85 backdrop-blur-md border border-[var(--color-badge-border,#cbd5e1)] shadow-xs';
    case 'white':
      return 'bg-white border border-slate-200/90 hover:border-slate-300 transition-colors';
    case 'theme-border':
    default:
      return 'bg-white border border-[var(--color-badge-border,#cbd5e1)] hover:border-[var(--color-primary)] transition-colors';
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
  let navActiveClasses = 'theme-btn-primary shadow-[0_0_12px_2px_var(--color-accent)] relative z-10 font-semibold';
  let navInactiveClasses = 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80';
  let cardBgClasses = 'bg-slate-50 border-slate-200/80 text-slate-800';
  let headerBorderClasses = 'border-slate-100';

  if (theme === 'dark') {
    themeClasses = `bg-slate-900 ${borderClass} border-slate-800 text-slate-100`;
    navActiveClasses = 'theme-btn-primary shadow-[0_0_12px_2px_var(--color-accent)] relative z-10 text-white font-semibold';
    navInactiveClasses = 'text-slate-400 hover:text-white hover:bg-slate-800/80';
    cardBgClasses = 'bg-slate-800/90 border-slate-700 text-slate-100';
    headerBorderClasses = 'border-slate-800';
  } else if (theme === 'brand') {
    themeClasses = `bg-[var(--color-primary)] ${borderClass} border-black/10 text-white`;
    navActiveClasses = 'bg-white/20 text-white font-bold backdrop-blur-xs shadow-[0_0_12px_2px_var(--color-accent)] relative z-10';
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

/**
 * Obtiene el color de fondo general de la aplicación según backgroundMode
 */
export function getAppBackgroundColor() {
  const mode = String(appConfig.appearance?.backgroundMode || 'tinted').trim().toLowerCase();
  const activeTheme = getActiveTheme();

  // Modo Blanco Absoluto
  if (mode === 'pure-white' || mode === 'white') {
    return '#ffffff';
  }
  // Modo Gris Técnico Neutro
  if (mode === 'zinc') {
    return '#f4f4f5';
  }
  // Modo Gris Ejecutivo
  if (mode === 'slate' || mode === 'gris') {
    return '#e2e8f0';
  }
  // Código de color exacto (ej. '#e0f2fe' o 'rgb(240, 249, 255)')
  if (mode.startsWith('#') || mode.startsWith('rgb')) {
    return mode;
  }
  // Modo Entintado Armónico ('tinted', 'theme', 'armonia') o si se escribió el nombre de un tema
  if (mode === 'tinted' || mode === 'theme' || mode === 'armonico' || appConfig.presets?.[mode]) {
    const targetTheme = appConfig.presets?.[mode] || activeTheme;
    return targetTheme.accentLight || '#f1f5f9';
  }

  // Fallback seguro: tinte armónico del tema activo
  return activeTheme.accentLight || '#f1f5f9';
}