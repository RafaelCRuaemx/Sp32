# 📘 Guía de Personalización del Sistema (`appConfig.js`)

Bienvenido a la guía oficial de configuración para los **5 equipos** del proyecto. Este archivo te explica **qué puedes modificar**, **dónde se cambia** y **qué estilos visuales puedes aplicar** en el archivo:

👉 [`src/config/appConfig.js`](file:///home/rafael/desarrollo/benitto_proyecto/fontend/src/config/appConfig.js)

> [!NOTE]
> **No necesitas tocar código React ni HTML.** Todos los cambios se realizan cambiando valores de texto (`'...'`), números o `true` / `false` en `appConfig.js`. Al guardar el archivo, los cambios se reflejan inmediatamente en el navegador.

---

## 📑 Índice de Contenidos
1. [Navegación y Layout (Barra Superior vs Menú Lateral)](#1-navegación-y-layout)
2. [Reordenar y Mover Elementos](#2-reordenar-y-mover-elementos)
3. [Paletas de Color y Temas](#3-paletas-de-color-y-temas)
4. [Tipografía y Fuentes](#4-tipografía-y-fuentes)
5. [Estilo de Tarjetas y Bordes](#5-estilo-de-tarjetas-y-bordes)
6. [Identidad Institucional y Escuela](#6-identidad-institucional)
7. [Padrón Escolar (Carreras, Roles y Grupos)](#7-padrón-escolar)
8. [Hardware ESP32 y Puntos de Acceso](#8-hardware-esp32-y-puntos-de-acceso)
9. [Horarios y Tolerancia de Retardos](#9-horarios-y-tolerancia-de-retardos)
10. [Motivos de Justificación de Faltas](#10-motivos-de-justificación-de-faltas)
11. [Ejemplos Listos para Copiar y Pegar](#11-ejemplos-listos-para-copiar)

---

## 1. Navegación y Layout

En el bloque `layout`, defines **dónde** se ubica el menú de navegación:

```javascript
layout: {
  // Opciones:
  // 'sidebar' (o 'slidebar') -> Menú vertical a la izquierda (Dashboard Ejecutivo)
  // 'top'                     -> Barra horizontal superior clásica
  navigationStyle: 'sidebar',

  navbar: {
    showLiveClock: true,      // true: muestra el reloj digital | false: lo oculta
    showHardwareBadge: true,  // true: muestra el estado del ESP32 | false: lo oculta
    tabsAlignment: 'center',  // 'left' | 'center' | 'right' (solo aplica en modo 'top')
  }
}
```

---

## 2. Reordenar y Mover Elementos

### A) Reordenar las Pestañas del Menú
Puedes cambiar la posición de las pantallas simplemente cambiando el orden en el arreglo `menuOrder`:

```javascript
// Ejemplo 1: Asistencia primero
menuOrder: ['bitacora', 'dashboard', 'altas', 'inasistencias'],

// Ejemplo 2: Gestión de Usuarios primero
menuOrder: ['altas', 'bitacora', 'dashboard', 'inasistencias'],
```

### B) Pantalla Inicial por Defecto
Elige qué pantalla se abre automáticamente cuando alguien entra al sistema:

```javascript
// Opciones: 'dashboard' | 'bitacora' | 'inasistencias' | 'altas'
defaultView: 'bitacora', 
```

### C) Mover y Reorganizar Secciones del Dashboard
Puedes cambiar qué sección aparece arriba y cuál abajo en el Panel de Control:

```javascript
dashboard: {
  // Opciones dentro del arreglo: 'kpis', 'charts', 'recentScans'
  
  // Ejemplo: Ver las gráficas arriba y las tarjetas abajo
  widgetsOrder: ['charts', 'kpis', 'recentScans'],

  // Ejemplo: Ver la tabla de accesos recientes al inicio
  // widgetsOrder: ['recentScans', 'charts', 'kpis'],
}
```

### D) Mover Botones en las Tablas
El botón de acción principal (**"+ Simular Lectura RFID"** o **"+ Crear Usuario"**) se puede colocar en dos lugares:

```javascript
tables: {
  // 'header'  -> Arriba a la derecha junto al título
  // 'toolbar' -> Abajo integrado junto al buscador y los filtros
  actionButtonPosition: 'toolbar',
}
```

---

## 3. Paletas de Color y Temas

Solo debes cambiar el valor de `themePreset`. El sistema aplicará los colores a botones, badges, acentos y reloj:

```javascript
themePreset: 'azul', // Elige una opción de la tabla
```

| Tema | Valor | Estilo Visual | Ideal Para |
| :--- | :--- | :--- | :--- |
| **Azul** | `'azul'` | Azul Tecnológico (#1d4ed8) | Carreras de Ingeniería, Sistemas, Informática |
| **Guinda** | `'guinda'` | Vino Tinto Institucional (#881337) | IPN, DGETI, CBTis, estilo escolar formal |
| **Verde** | `'verde'` | Verde Esmeralda (#047857) | Mecatrónica, Conalep, áreas ambientales |
| **Morado** | `'morado'` | Púrpura Innovación (#6d28d9) | Robótica, IA, Telecomunicaciones |
| **Slate** | `'slate'` | Gris Grafito Neutro (#0f172a) | Estilo ejecutivo sobrio de alto contraste |

> [!TIP]
> **¿Quieres un color HEX exacto de tu escuela?**
> Dentro de `presets` en `appConfig.js`, puedes modificar directamente el código `#hex` (ej: `#003366` para azul marino UNAM o `#006633` para verde militar).

---

## 4. Tipografía y Fuentes

Cambia la fuente de todo el sistema modificando `fontFamily`:

```javascript
fontFamily: 'sans', // Elige: 'sans' | 'serif' | 'mono'
```

- **`'sans'`**: Moderna, limpia y legible (Inter / Apple System). Recomendada por defecto.
- **`'serif'`**: Clásica, formal y universitaria (Georgia / Times New Roman).
- **`'mono'`**: Estilo consola de programación / laboratorio de robótica (Monospace / Menlo).

---

## 5. Estilo de Tarjetas y Bordes

Modifica la forma de los contenedores, modales y tablas:

```javascript
cards: {
  // 'none'    -> Bordes rectos y cuadrados (estilo técnico)
  // 'rounded' -> Redondeo suave estándar (rounded-lg)
  // 'curved'  -> Curvas modernas pronunciadas (rounded-2xl)
  borderRadius: 'curved',
}
```

---

## 6. Identidad Institucional

Personaliza el nombre de tu plantel, siglas, responsable y pie de página:

```javascript
institution: {
  name: 'CBTis No. 203',                       // Nombre que aparece en el Navbar y Dashboard
  shortName: 'CBTIS-203',                      // Siglas en el badge superior
  subtitle: 'Control de Asistencia Estudiantil', // Subtítulo
  cct: 'CCT: 15DCT0203Z',                      // Clave de Centro de Trabajo para reportes
  responsable: 'Ing. Marco Antonio Ruiz',      // Encargado de Control Escolar
  copyright: '© 2026 Equipo 2 • Sistema de Asistencia RFID',
}
```

---

## 7. Padrón Escolar

Configura las especialidades, carreras y roles que existen en tu escuela. Al cambiarlos aquí, **los menús desplegables del modal de usuarios y los botones de filtro se actualizarán automáticamente**:

```javascript
academic: {
  // Roles que se pueden registrar:
  roles: ['Estudiante', 'Docente', 'Administrativo', 'Visitante'],

  // Carreras que aparecerán en el selector:
  areas: [
    'Técnico en Programación',
    'Técnico en Mecatrónica',
    'Técnico en Contabilidad',
    'Tronco Común',
    'Personal Administrativo',
  ],

  // Grupos disponibles:
  groups: [
    '2do A - Programación',
    '4to B - Mecatrónica',
    '6to A - Contabilidad',
  ],
}
```

---

## 8. Hardware ESP32 y Puntos de Acceso

Configura el microcontrolador y los lectores RFID de tu plantel:

```javascript
hardware: {
  label: 'ESP32-S3',
  name: 'Torniquete Entrada Principal',
  ip: '192.168.1.150', // IP asignada a tu ESP32 en la red local
  status: 'Online',

  // Nombres de los torniquetes o accesos de tu escuela:
  accessPoints: [
    'Torniquete 01 - Entrada Principal',
    'Torniquete 02 - Cafetería',
    'Acceso a Biblioteca',
    'Laboratorio de Cómputo B',
  ],
}
```

---

## 9. Horarios y Tolerancia de Retardos

Reglas de tiempo para la jornada escolar:

```javascript
schedule: {
  horaEntrada: '07:00',    // Llegadas antes de esta hora = "A tiempo"
  horaTolerancia: '07:15', // Llegadas entre 07:00 y 07:15 = "Retardo" (posterior = Falta)
}
```

---

## 10. Motivos de Justificación de Faltas

Modifica la lista de motivos oficiales que aparecen en el modal de justificaciones:

```javascript
justifications: [
  'Incapacidad Médica IMSS / ISSSTE',
  'Cita Médica con Comprobante',
  'Asunto Familiar Justificado',
  'Comisión Cívica / Deportiva',
  'Trámite de Beca o Administrativo',
]
```

---

## 11. Ejemplos Listos para Copiar

### Ejemplo A: Configuración "Estilo Tecnológico / Robótica"
```javascript
layout: {
  navigationStyle: 'sidebar',
  defaultView: 'dashboard',
  menuOrder: ['dashboard', 'bitacora', 'altas', 'inasistencias'],
  dashboard: {
    widgetsOrder: ['charts', 'kpis', 'recentScans'],
    kpiColumns: 3,
    chartLayout: 'side-by-side',
  },
  cards: { borderRadius: 'curved' },
  tables: { actionButtonPosition: 'toolbar' },
},
themePreset: 'morado',
fontFamily: 'mono',
```

### Ejemplo B: Configuración "Estilo Institucional Formal"
```javascript
layout: {
  navigationStyle: 'top',
  defaultView: 'bitacora',
  menuOrder: ['bitacora', 'dashboard', 'inasistencias', 'altas'],
  navbar: { tabsAlignment: 'center', showLiveClock: true },
  dashboard: {
    widgetsOrder: ['kpis', 'charts', 'recentScans'],
    kpiColumns: 4,
    chartLayout: 'stacked',
  },
  cards: { borderRadius: 'rounded' },
  tables: { actionButtonPosition: 'header' },
},
themePreset: 'guinda',
fontFamily: 'serif',
```

---

## 🛠️ Comprobación y Verificación

Cada vez que realices cambios, puedes verificar que todo compile sin errores ejecutando:

```bash
npm run lint    # Verifica que la sintaxis sea correcta (debe marcar 0 errores)
npm run build   # Compila el paquete de producción para verificar integridad
```

