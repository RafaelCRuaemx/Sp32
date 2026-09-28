# 📘 Guía Maestra de Configuración del Sistema (`appConfig.js`)

Bienvenido a la guía oficial de personalización para los **equipos y administradores** del proyecto de Control Escolar y Asistencia RFID. 

Este documento explica al detalle **qué opciones existen**, **dónde se modifican** y **el efecto visual o funcional de cada parámetro** dentro del archivo:

👉 [`src/config/appConfig.js`](file:///home/rafael/desarrollo/benitto_proyecto/fontend/src/config/appConfig.js)

> [!NOTE]
> **No necesitas modificar código React, JSX ni CSS.** Toda la apariencia, las reglas de negocio, los sonidos, la navegación y la seguridad se configuran modificando valores simples (`true`/`false`, números o texto `'...'`) en `appConfig.js`. Los cambios se reflejan inmediatamente en el navegador al guardar el archivo.

---

## 📑 Índice de Secciones

1. [Seguridad y Acceso 2FA (Google Authenticator)](#1-seguridad-y-acceso-2fa-google-authenticator)
2. [Fondo de Pantalla y Apariencia General](#2-fondo-de-pantalla-y-apariencia-general)
3. [Estilo y Bordes de Tarjetas](#3-estilo-y-bordes-de-tarjetas)
4. [Efectos de Sonido RFID (Web Audio API)](#4-efectos-de-sonido-rfid-web-audio-api)
5. [Navegación y Layout (Topbar, Sidebar y Bottom Dock)](#5-navegación-y-layout)
6. [Paletas de Color y Temas Institucionales](#6-paletas-de-color-y-temas)
7. [Estilo de Botones e Interactividad](#7-estilo-de-botones-e-interactividad)
8. [Marca de Agua / Escudo Institucional](#8-marca-de-agua--escudo-institucional)
9. [Módulos Activos y Nombres de Pestañas](#9-módulos-activos-y-nombres-de-pestañas)
10. [Identidad Institucional y Escuela](#10-identidad-institucional)
11. [Padrón Escolar (Carreras, Roles y Grupos)](#11-padrón-escolar)
12. [Hardware ESP32 y Antenas RFID](#12-hardware-esp32-y-antenas-rfid)
13. [Horarios de Tolerancia y Retardos](#13-horarios-de-tolerancia-y-retardos)
14. [Paginación Global de Tablas](#14-paginación-global-de-tablas)
15. [Reportes y Descargas CSV](#15-reportes-y-descargas-csv)
16. [Modo Exposición / Demostración Automática](#16-modo-exposición--demostración-automática)
17. [Nombres y Badges de Estados de Asistencia](#17-nombres-y-badges-de-estados-de-asistencia)
18. [Visibilidad de Columnas en Tablas](#18-visibilidad-de-columnas-en-tablas)
19. [Reglas del Formulario de Altas de Usuario](#19-reglas-del-formulario-de-altas-de-usuario)
20. [Turnos y Metas del Dashboard](#20-turnos-y-metas-del-dashboard)
21. [Botones de Filtro Rápido en Tablas](#21-botones-de-filtro-rápido-en-tablas)
22. [Reglas de Justificación de Faltas](#22-reglas-de-justificación-de-faltas)
23. [Ejemplos Listos para Copiar y Pegar](#23-ejemplos-listos-para-copiar)

---

## 1. Seguridad y Acceso 2FA (Google Authenticator)

Controla los candados de seguridad, la confirmación de acciones delicadas y la autenticación de dos factores (TOTP RFC 6238):

```javascript
security: {
  requireConfirmOnDelete: true,    // ¿Exigir doble confirmación antes de dar de baja a un alumno/tarjeta?
  requireConfirmOnJustify: true,   // ¿Exigir doble confirmación antes de asentar justificación?
  maskTutorPhone: false,           // true: oculta el teléfono en pantalla (ej: 55-****-5678)
  allowExportCsv: true,            // ¿Permitir a los usuarios descargar reportes CSV?
  toastDurationMs: 3500,           // Duración en pantalla de las notificaciones toast (ms)

  // Autenticación Administrativa y 2FA
  auth: {
    requireLogin: true,            // true: exige usuario, contraseña y 2FA | false: acceso directo al sistema
    enable2FA: true,               // ¿Solicitar los 6 dígitos de Google Authenticator?
    mockMode: true,                // true: simula validación en frontend | false: conecta con Django REST
    issuerName: 'Control Escolar RFID', // Nombre del emisor visible en la app del celular
  },
}
```

> [!TIP]
> **Modo Bypass para Desarrollo:** Si estás diseñando o maquetando y no deseas loguearte a cada momento, cambia temporalmente `requireLogin: false`. Cuando vayas a exponer o presentar el proyecto, vuelve a colocar `requireLogin: true`.

---

## 2. Fondo de Pantalla y Apariencia General

Permite controlar el tono del fondo de toda la pantalla a través de `appearance.backgroundMode`:

```javascript
appearance: {
  // 'slate'      -> Fondo gris pizarra estándar (#f8fafc), limpio y neutro
  // 'tinted'     -> Tinte suave derivado del color del tema activo
  // 'pure-white' -> Blanco absoluto (#ffffff) para alto contraste
  // 'zinc'       -> Gris técnico industrial (#f4f4f5)
  // '#hex'       -> Código hexadecimal personalizado (ej: '#f1f5f9', '#e2e8f0')
  backgroundMode: 'slate',

  // Tamaño de texto general: 'compact' (14px) | 'normal' (15px) | 'large' (17px)
  fontSize: 'normal',

  // Densidad de renglones en tablas: 'compact' | 'normal' | 'relaxed'
  tableDensity: 'normal',

  // Nivel de elevación y sombra de paneles: 'none' | 'soft' | 'elevated'
  cardShadow: 'soft',
}
```

---

## 3. Estilo y Bordes de Tarjetas

Define el aspecto de los paneles de métricas, formularios y tablas en `layout.cards`:

```javascript
layout: {
  cards: {
    // Curvatura de esquinas:
    // 'none'    -> Rectas en punta (0px)
    // 'rounded' -> Suave estándar (8px)
    // 'curved'  -> Curvas modernas pronunciadas (16px)
    borderRadius: 'curved',

    // Estilo visual del fondo y borde:
    // 'theme-border' -> Fondo blanco con borde tintado con el color del tema activo (Recomendado)
    // 'white'        -> Fondo blanco puro con borde gris neutral (#e2e8f0)
    // 'tinted'       -> Fondo coloreado con el tinte suave del tema (accentLight)
    // 'glass'        -> Efecto translúcido estilo cristal esmerilado con desenfoque
    style: 'theme-border',
  }
}
```

---

## 4. Efectos de Sonido RFID (Web Audio API)

El sistema incluye un sintetizador nativo de audio mediante la API Web Audio del navegador (no requiere descargar archivos `.mp3` ni consume datos):

```javascript
sounds: {
  enabled: true,    // ¿Reproducir pitidos audibles en lecturas RFID y acciones?
  volume: 0.15,     // Nivel de volumen (0.01 a 1.0)
}
```

* **Acceso Correcto (A tiempo):** Beep agudo agradable (880 Hz).
* **Retardo:** Tono medio de aviso (587 Hz).
* **Falta o Denegado:** Zumbido grave de alerta (220 Hz).

---

## 5. Navegación y Layout

Configura cómo y dónde se despliegan los menús del sistema:

```javascript
layout: {
  // 'sidebar' (o 'slidebar') -> Menú lateral vertical (ideal para computadoras de escritorio)
  // 'top'                     -> Barra horizontal superior clásica
  // 'bottom' (o 'dock')       -> Barra flotante inferior tipo iPad / macOS
  navigationStyle: 'top',

  // Opciones de la barra superior (navigationStyle: 'top'):
  navbar: {
    showLiveClock: true,      // Reloj con fecha y hora en vivo
    showHardwareBadge: true,  // Widget indicador del ESP32 en línea
    tabsAlignment: 'center',  // 'left' | 'center' | 'right'
  },

  // Opciones del menú lateral (navigationStyle: 'sidebar'):
  sidebar: {
    theme: 'light',           // 'light' (blanco) | 'dark' (oscuro ejecutivo) | 'brand' (color institucional)
    position: 'left',         // 'left' (menú a la izquierda) | 'right' (menú a la derecha)
    width: 'normal',          // 'compact' | 'normal' | 'wide'
    behavior: 'fixed',        // 'fixed' (fijo) | 'hover' (se expande al pasar el mouse) | 'auto-hide' (oculto)
  },
}
```

---

## 6. Paletas de Color y Temas

Cambia el valor de `themePreset` para teñir toda la aplicación (botones, insignias, bordes y acentos):

```javascript
themePreset: 'azul', // Elige una opción de la tabla
```

| Preset | Nombre del Tema | Color Primario Hex | Contexto Recomendado |
| :--- | :--- | :--- | :--- |
| `'azul'` | Azul Tecnológico | `#1d4ed8` | Ingeniería, Informática, Sistemas |
| `'guinda'` | Vino Institucional | `#881337` | CBTis, IPN, DGETI, Escuelas Técnicas |
| `'verde'` | Esmeralda Ambiental | `#047857` | Robótica, Conalep, Ciencias Biológicas |
| `'morado'` | Púrpura Innovación | `#6d28d9` | Laboratorios Maker, Telecomunicaciones |
| `'slate'` | Gris Grafito | `#0f172a` | Estilo ejecutivo sobrio de alto contraste |

---

## 7. Estilo de Botones e Interactividad

Controla la forma geométrica y sombra de todos los botones principales y secundarios:

```javascript
buttons: {
  // 'square'  -> Rectos con esquinas en punta (0px)
  // 'rounded' -> Esquinas redondeadas estándar (8px)
  // 'pill'    -> Forma de píldora completamente redonda (full rounded)
  borderRadius: 'rounded',

  // 'flat'     -> Plano sin sombra
  // 'soft'     -> Sombra suave moderna
  // 'elevated' -> Sombra prominente con relieve
  elevation: 'elevated',
}
```

---

## 8. Marca de Agua / Escudo Institucional

Permite proyectar el escudo escolar o logotipo institucional de fondo en toda la aplicación:

```javascript
watermark: {
  enabled: false,              // true: muestra marca de agua | false: oculta
  imageUrl: '',                // Ruta de la imagen (ej: '/logos/escudo_uam.png')
  opacity: 0.04,               // Opacidad tenue (0.02 a 0.08 para no saturar la lectura)
  size: '420px',               // Dimensión del escudo
  position: 'center',          // 'center' | 'bottom-right'
}
```

---

## 9. Módulos Activos y Nombres de Pestañas

Permite encender, apagar o renombrar las vistas del sistema:

```javascript
modules: {
  dashboard: {
    enabled: true,
    label: 'Estadísticas',
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
}
```

---

## 10. Identidad Institucional

Datos que se muestran en el encabezado, badges y reportes oficiales:

```javascript
institution: {
  name: 'Preparatoria Benito Juárez',           // Nombre oficial del plantel
  shortName: 'PBJ-RFID',                       // Siglas del badge
  subtitle: 'Control de Asistencia Estudiantil',
  cct: 'CCT: 15EBH0123X',                      // Clave de Centro de Trabajo
  responsable: 'Lic. Roberto Gómez',           // Director o Prefecto
  copyright: '© 2026 Sistema Escolar RFID',
  logoUrl: '',                                 // Ruta del logo escolar
}
```

---

## 11. Padrón Escolar

Alimentación de los menús desplegables de registro y filtros de búsqueda:

```javascript
academic: {
  roles: ['Estudiante', 'Docente', 'Administrativo', 'Visitante'],
  areas: [
    'Técnico en Programación',
    'Técnico en Mecatrónica',
    'Técnico en Contabilidad',
    'Tronco Común',
  ],
  groups: [
    '101 - Matutino',
    '201 - Matutino',
    '301 - Vespertino',
  ],
}
```

---

## 12. Hardware ESP32 y Antenas RFID

Parámetros del microcontrolador conectado al lector de tarjetas RC522 / PN532:

```javascript
hardware: {
  label: 'ESP32-S3',
  name: 'Torniquete Entrada Principal',
  ip: '192.168.1.145',         // Dirección IP asignada en la red WiFi escolar
  status: 'Online',             // 'Online' | 'Offline' | 'Standby'
  accessPoints: [
    'Torniquete 01 - Entrada Principal',
    'Torniquete 02 - Pasillo Laboratorios',
    'Puerta Biblioteca',
  ],
}
```

---

## 13. Horarios de Tolerancia y Retardos

Reglas para clasificar automáticamente las lecturas de tarjetas en la bitácora:

```javascript
schedule: {
  horaEntrada: '07:15',        // Lecturas previas = "A tiempo"
  horaTolerancia: '07:30',     // Lecturas intermedias = "Retardo"
  toleranciaMinutos: 15,       // Margen de tolerancia
  limiteFaltaMinutos: 30,      // Posterior = "Falta definitiva"
}
```

---

## 14. Paginación Global de Tablas

Controla la división de páginas en Asistencias, Inasistencias y Padrón:

```javascript
pagination: {
  itemsPerPage: 5,             // Registros mostrados al cargar (5, 10, 20)
  allowUserPageSize: true,     // ¿Permitir al usuario cambiar a 10, 25 o 50 filas?
  pageSizes: [5, 10, 25, 50],
  showTotalCount: true,        // ¿Mostrar leyenda "Mostrando X a Y de Z registros"?
  style: 'numeric',            // 'numeric' (1, 2, 3...) o 'simple' (Anterior / Siguiente)
}
```

---

## 15. Reportes y Descargas CSV

Formato de exportación compatible con Microsoft Excel y hojas de cálculo:

```javascript
reports: {
  csvDelimiter: ',',            // ',' para estándar o ';' para Excel en español
  fileNamePrefix: 'REPORTE_',   // Prefijo de los archivos descargados
  includeTimestamp: true,       // Añade fecha y hora al nombre del archivo
}
```

---

## 16. Modo Exposición / Demostración Automática

Ideal para ferias de proyectos escolares o stands de demostración donde no se cuenta con tarjetas físicas a la mano:

```javascript
demoMode: {
  // 0 = Apagado (lecturas manuales con el botón "+ Simular Lectura")
  // 5 = Genera automáticamente una lectura simulada cada 5 segundos
  autoScanIntervalSeconds: 0,
}
```

---

## 17. Nombres y Badges de Estados de Asistencia

Permite personalizar el texto y el color de los estatus que aparecen en la bitácora y en el dashboard:

```javascript
statusLabels: {
  a_tiempo: { label: 'A tiempo', color: 'emerald' }, // 'emerald' | 'blue'
  retardo:  { label: 'Retardo',  color: 'amber' },   // 'amber'
  denegado: { label: 'Denegado', color: 'rose' },    // 'rose' | 'red'
  falta:    { label: 'Inasistencia', color: 'red' },
}
```

---

## 18. Visibilidad de Columnas en Tablas

Permite ocultar o mostrar columnas específicas en las tablas para simplificar la lectura a directores o profesores:

```javascript
tablesDisplay: {
  bitacora: {
    showUidColumn: true,       // true: muestra columna de código hexadecimal UID | false: la oculta
    showDoorColumn: true,      // true: muestra el torniquete o puerta de acceso
  },
  altas: {
    showPhoneColumn: true,     // true: muestra teléfono del tutor en contacto
    showEmailColumn: true,     // true: muestra correo institucional en contacto
    showDateColumn: true,      // true: muestra fecha de alta debajo de la tarjeta
  },
  inasistencias: {
    showJustifyButton: true,   // true: muestra botón "Justificar" | false: vista de solo lectura
  },
}
```

---

## 19. Reglas del Formulario de Altas de Usuario

Define qué campos son obligatorios al registrar nuevos alumnos o personal:

```javascript
userRegistration: {
  requireEmail: false,         // false: el correo es opcional | true: obligatorio para guardar
  requirePhone: true,          // true: exige ingresar el teléfono del tutor
  defaultRole: 'Estudiante',   // Rol seleccionado por defecto al abrir el modal ('Estudiante', 'Docente')
  autoUppercaseName: true,     // Convierte automáticamente el nombre a MAYÚSCULAS mientras se escribe
}
```

---

## 20. Turnos y Metas del Dashboard

Configura el turno de la escuela y el umbral de alerta de asistencia estudiantil:

```javascript
dashboardSchedule: {
  activeShift: 'matutino',     // 'matutino' (horas de 06:30 a 08:30) | 'vespertino' (13:30 a 15:30)
  targetAttendancePercentage: 85, // Meta institucional en % (si cae por debajo, el KPI avisa en ámbar)
}
```

---

## 21. Botones de Filtro Rápido en Tablas

Define qué botones de filtro con un solo clic aparecen arriba de cada tabla:

```javascript
quickFilters: {
  bitacora: ['todos', 'a_tiempo', 'retardo', 'denegado'],
  altas: ['todos', 'Estudiante', 'Docente', 'Administrativo'],
}
```

---

## 22. Reglas de Justificación de Faltas

Controla los requerimientos mínimos del modal al justificar inasistencias:

```javascript
justificationsForm: {
  requireFolio: true,          // true: exige folio de receta médica o comprobante
  requireObservations: false,  // true: exige redactar notas explicativas
  defaultReason: 'Incapacidad Médica IMSS / ISSSTE', // Motivo predeterminado
}
```

---

## 23. Ejemplos Listos para Copiar

### Ejemplo A: Configuración "Preparatoria Tecnológica Moderna"
```javascript
themePreset: 'morado',
appearance: { backgroundMode: 'tinted', fontSize: 'normal', cardShadow: 'soft' },
layout: {
  navigationStyle: 'top',
  cards: { borderRadius: 'curved', style: 'theme-border' },
},
buttons: { borderRadius: 'pill', elevation: 'soft' },
sounds: { enabled: true, volume: 0.2 },
security: { auth: { requireLogin: true, enable2FA: true, mockMode: true } },
tablesDisplay: { bitacora: { showUidColumn: false } }, // Oculta UIDs técnicos
```

### Ejemplo B: Configuración "Plantel Institucional Formal (Guinda / CBTis)"
```javascript
themePreset: 'guinda',
appearance: { backgroundMode: 'slate', fontSize: 'compact', cardShadow: 'elevated' },
layout: {
  navigationStyle: 'sidebar',
  sidebar: { theme: 'dark', position: 'left', behavior: 'fixed' },
  cards: { borderRadius: 'rounded', style: 'white' },
},
buttons: { borderRadius: 'rounded', elevation: 'elevated' },
security: { auth: { requireLogin: true, enable2FA: true, mockMode: true } },
dashboardSchedule: { activeShift: 'vespertino', targetAttendancePercentage: 90 },
```

---

## 🛠️ Comprobación y Verificación de Sintaxis

Cada vez que edites `appConfig.js`, puedes confirmar que no existan errores de escritura ejecutando en tu terminal:

```bash
npm run lint    # Debe reportar: "Found 0 warnings and 0 errors"
npm run build   # Debe compilar el proyecto en ~350ms
```
