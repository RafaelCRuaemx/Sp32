# 🏫 Sistema de Control de Acceso Escolar RFID (ESP32 + Django + React)

Sistema integral para el control de asistencia y acceso escolar mediante tarjetas RFID (13.56 MHz), microcontrolador ESP32, API REST en Django y panel de control web en React (Vite + Tailwind CSS).

---

## 📐 Arquitectura General del Sistema

```
                      [ Tarjeta RFID 13.56 MHz ]
                                  │
                                  ▼
                   [ Hardware ESP32 + RC522 ]
                     (Torniquete o Entrada)
                                  │
                                  │ HTTP POST /api/accesos/ (WiFi Local)
                                  ▼
             ┌─────────────────────────────────────────┐
             │       Backend Django REST Framework     │
             │       Base de Datos (SQLite/PostgreSQL) │
             └────────────────────┬────────────────────┘
                                  │
                                  │ JSON API (HTTP / WebSockets)
                                  ▼
             ┌─────────────────────────────────────────┐
             │        Frontend React (Vite + Tailwind) │
             │   - Dashboard con KPIs y telemetría     │
             │   - Registro de Asistencia en vivo      │
             │   - Gestión y Justificación de Ausencias│
             │   - Directorio y Edición de Usuarios    │
             └─────────────────────────────────────────┘
```

---

## 🚀 Puesta en Marcha en Desarrollo Local

### 1. Requisitos Previos
- Node.js (v18 o superior) y npm
- Python 3.10+ y pip (para Django)

### 2. Levantar el Frontend (React + Vite)
```bash
# Entrar a la carpeta del frontend
cd fontend

# Instalar dependencias (si es primera vez)
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```
La aplicación web abrirá en: `http://localhost:5173`.

---

## 🎨 Personalización Visual y Layout Multi-Equipo (`appConfig.js`)

El proyecto cuenta con un sistema centralizado para que **cualquiera de los 5 equipos** pueda personalizar los colores, tipografía, maquetación (menú horizontal superior vs menú lateral izquierdo), orden de pestañas y reglas escolares editando únicamente [`src/config/appConfig.js`](src/config/appConfig.js).

📖 **Consulta la [Guía Completa de Personalización](src/config/README.md)** para ver:
- Cómo alternar entre **Menú Lateral (`'sidebar'`)** y **Barra Superior (`'top'`)**.
- Cómo cambiar el orden de las pestañas (`menuOrder`) o la pantalla de inicio (`defaultView`).
- Cómo mover o reorganizar las tarjetas y gráficas del Dashboard (`widgetsOrder`).
- Paletas de colores listas: Azul Tecnológico, Guinda Institucional, Verde Esmeralda, Púrpura Innovación y Slate Neutro.
- Configuración de carreras, roles, horarios y justificaciones.

---

## 🔗 Conexión Frontend con Backend Django (Misma Máquina)

Cuando desarrollas en tu computadora, el frontend corre en el puerto `5173` y Django en el puerto `8000`.

### 1. Habilitar CORS en Django *(Obligatorio para evitar bloqueos del navegador)*
En el entorno virtual de Django:
```bash
pip install django-cors-headers
```

En el archivo `settings.py` de Django:
```python
INSTALLED_APPS = [
    ...,
    'corsheaders',  # Agregar
    'rest_framework',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Debe ir arriba de todo
    'django.middleware.common.CommonMiddleware',
    ...,
]

# Permitir solicitudes desde el puerto de React:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### 2. Variable de Entorno en el Frontend
En `fontend/.env`:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 📋 Contratos de Endpoints (API de Django)

Todos los endpoints están documentados y centralizados en [`src/services/api.js`](file:///home/rafael/desarrollo/benitto_proyecto/fontend/src/services/api.js):

| Módulo | Método | Endpoint en Django | Propósito |
|---|---|---|---|
| **Dashboard** | `GET` | `/api/dashboard/resumen/` | KPIs de asistencia, retardos, gráfica y estado del ESP32 |
| **Asistencia** | `GET` | `/api/accesos/?search=&estado=` | Historial de escaneos recibidos |
| **Asistencia** | `POST` | `/api/accesos/simular-lectura/` | Simular envío de tarjeta desde la web |
| **Inasistencias** | `GET` | `/api/inasistencias/?fecha=` | Alumnos que no pasaron tarjeta hoy |
| **Inasistencias** | `PATCH` | `/api/inasistencias/:id/justificar/` | Guardar motivo, folio y observaciones |
| **Usuarios** | `GET` | `/api/usuarios-rfid/?search=` | Padrón activo de usuarios y tarjetas |
| **Usuarios** | `POST` | `/api/usuarios-rfid/` | Registrar nuevo usuario y asociar UID RFID |
| **Usuarios** | `DELETE` | `/api/usuarios-rfid/:id/` | Dar de baja usuario y desvincular tarjeta |
| **ESP32 Link** | `GET` | `/api/esp32/ultimo-uid-leido/` | Captura en vivo de la tarjeta acercada a la antena |

---

## 🌐 Cómo Pasar el Proyecto a Producción

Para instalar el sistema en una red escolar (laptop servidor, Raspberry Pi o servidor local de la escuela):

### Método Recomendado: Django sirviendo directamente el Build de React (Todo en 1 puerto)

Este método es el más confiable para escuelas porque **no requiere conexión a internet** y todo funciona en la red WiFi local bajo un solo puerto (ej. `8000`).

#### Paso 1: Compilar React
En la carpeta `fontend/`:
```bash
npm run build
```
Esto creará la carpeta optimizada `fontend/dist/`.

#### Paso 2: Configurar Django para servir la carpeta `dist/`
En el archivo `settings.py` de Django:
```python
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Indicar a Django dónde están los estáticos compilados de React
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, '../fontend/dist'),
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, '../fontend/dist')], # Carpeta con el index.html de React
        'APP_DIRS': True,
        ...,
    },
]
```

#### Paso 3: Configurar las URLs en Django
En el archivo `urls.py` principal de Django:
```python
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tu_app.urls')), # Rutas de la API para ESP32 y React
    
    # Cualquier otra ruta sirve la aplicación de React:
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
```

#### Paso 4: Levantar el servidor en la Red Escolar
```bash
python manage.py runserver 0.0.0.0:8000
```
Cualquier computadora conectada al WiFi escolar podrá ingresar a `http://<IP_DE_LA_MAQUINA>:8000` para ver el sistema en tiempo real.

---

## 🔘 Botones de Acción y Confirmaciones

A continuación se detalla qué botones requieren o no doble confirmación y por qué:

### 1. Botones que NO requieren doble confirmación (Acciones Seguras o Reversibles):
- **"Simular Lectura RFID" (Registro de Asistencia):**
  - *Comportamiento:* Genera un evento de prueba en la tabla. No borra nada ni altera datos existentes.
- **"📡 Leer ESP32" (Formulario de Usuarios):**
  - *Comportamiento:* Solo rellena el campo de texto del UID capturado en la antena. Es una ayuda de captura.
- **"Crear Usuario" (Pantalla de Usuarios):**
  - *Comportamiento:* Solo abre el modal de captura. No realiza ningún cambio en la base de datos hasta que se envía el formulario.
- **"Editar" (Fila de Usuario):**
  - *Comportamiento:* Abre el modal precargado con los datos del usuario. Es una acción de apertura segura.
- **"Justificar" (Inasistencias):**
  - *Comportamiento:* Abre el modal de captura de motivos y folio.
- **Filtros y Búsquedas:**
  - *Comportamiento:* Filtrado reactivo en memoria que no modifica registros.

### 2. Botones que ejecutan cambios definitivos:
- **"Guardar Cambios / Registrar Usuario" (Dentro del Modal):**
  - Ejecuta la creación/actualización con validación de campos obligatorios y muestra notificación *Toast* inmediata.
- **"Eliminar / Dar de Baja Usuario" (Icono de papelera en la fila):**
  - *Acción destructiva:* Actualmente ejecuta la eliminación local y envía la notificación flotante. Si deseas máxima seguridad para evitar clics accidentales en producción, puede agregarse un pequeño diálogo modal de confirmación (*"¿Deseas desvincular a este usuario?"*).
