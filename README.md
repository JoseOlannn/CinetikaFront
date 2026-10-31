# 🎬 Cinetika — Explorador de Películas y Series

> Plataforma para explorar contenido audiovisual con una estética **retro ochentera**, inspirada en el **arte pop** y la **Bauhaus**.

---

## 1. Descripción General y Objetivo del MVP

**Nombre del proyecto:** Cinetika — Explorador de Películas y Series

**Objetivo del MVP:**  
Crear una plataforma funcional donde los usuarios puedan **registrarse**, **explorar un catálogo** de contenido audiovisual (películas, series y cortometrajes), **buscar títulos** y **consultar sus detalles**, bajo una temática visual retro inspirada en los años 80 y el arte pop / Bauhaus.

---

## 2. Alcance Funcional del MVP

### 🔐 Registro e inicio de sesión
- Crear cuenta e iniciar sesión.
- Cerrar sesión.
- Persistencia de sesión con almacenamiento local del token.

### 🎞️ Catálogo de películas y series
- Mostrar películas, series y cortometrajes.
- Mostrar póster, nombre, año y categoría (tipo de contenido).
- Organizar el contenido por géneros.
- Temática visual retro, inspirada en los años 80 y el arte pop / Bauhaus.

### 🔎 Búsqueda y filtros
- Buscar por nombre.
- Filtrar por género y tipo de contenido.
- Explorar títulos.

### 📄 Detalles del contenido
- Mostrar sinopsis, año, género, duración y calificación.
- Reproductor de video y tráilers integrado (YouTube, Vimeo, MP4).

### 👤 Perfil de usuario
- Mostrar nombre, correo y foto de perfil.
- Permitir editar la información básica (nombre, foto y contraseña).
- Utilizar una foto predeterminada si el usuario no ha configurado una.
- Eliminar cuenta de usuario.

---

## 3. Tecnologías a Utilizar

| Capa | Tecnología | Descripción / Uso |
|------|------------|-------------------|
| **Frontend** | [React](https://react.dev/) | Librería para la construcción de interfaces interactivas y modulares basada en componentes. |
| **Build Tool** | [Vite](https://vitejs.dev/) | Entorno de desarrollo ultrarrápido y empaquetador del frontend. |
| **Enrutamiento** | [React Router](https://reactrouter.com/) | Manejo declarativo de rutas y navegación SPA. |
| **Estilos** | CSS3 / Variables Globales | Diseño Bauhaus y arte pop con variables CSS centralizadas y estilos por componente. |
| **Base de datos** | [MongoDB Atlas](https://www.mongodb.com/) | Base de datos NoSQL para almacenar usuarios y catálogo audiovisual. |

---

## 4. Temática y Estilo Visual

- 🎨 **Paleta de color ochentera:** Colores intensos, contrastes dinámicos y acentos neón.
- 🔷 **Geometría Bauhaus:** Uso de figuras geométricas básicas (círculos, triángulos, rectángulos), bordes gruesos y diagramación limpia.
- 🖼️ **Arte Pop:** Tipografías contundentes, bloques de color sólidos y estética retro vibrante.

---

## 5. Estructura del Proyecto

```text
CinetikaFront/
├── public/
│   ├── images/
│   │   ├── default-avatar.png   # Avatar predeterminado retro
│   │   └── logo.png             # Logotipo oficial de Cinetika
│   └── favicon.ico
├── src/
│   ├── assets/                  # Recursos gráficos y multimedia
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthForm.jsx         # Formulario de Login y Registro conectado a la API
│   │   │   └── FondoPortadas.jsx    # Mosaico de portadas retro de fondo
│   │   ├── catalog/
│   │   │   ├── ContentCard.jsx      # Tarjeta individual con póster, duración, año y botón Ver
│   │   │   ├── ContentGrid.jsx      # Cuadrícula responsiva de contenidos
│   │   │   ├── FeaturedBanner.jsx   # Hero Banner carrusel horizontal con desenfoque
│   │   │   └── GenreFilter.jsx      # Selector desplegable de géneros disponibles
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx       # Layout principal que envuelve las páginas con Navbar
│   │   │   └── Navbar.jsx           # Barra de navegación con buscador, enlaces y menú de usuario
│   │   └── ui/
│   │       ├── Button.jsx           # Botón estilizado retro (primary, secondary, outline)
│   │       ├── IconButton.jsx       # Botón con iconos SVG
│   │       └── Input.jsx            # Input con soporte para toggle de contraseñas
│   ├── pages/
│   │   ├── Catalogo.jsx         # Página principal del catálogo con filtros de categoría y género
│   │   ├── ContentDetail.jsx    # Vista de detalle con reproductor modal de video/tráiler
│   │   ├── EditProfile.jsx      # Edición de perfil, carga de avatar y eliminación de cuenta
│   │   ├── Login.jsx            # Pantalla de acceso
│   │   ├── Register.jsx         # Pantalla de registro de usuarios
│   │   └── SearchResults.jsx    # Resultados de búsqueda en tiempo real
│   ├── services/
│   │   ├── api.js               # Cliente HTTP base centralizado (fetch con soporte JWT)
│   │   ├── authService.js       # Servicios de autenticación (login, register, logout, getCurrentUser)
│   │   ├── catalogService.js    # Servicios para consumir el catálogo y detalles desde el backend
│   │   └── profileService.js    # Servicios para actualizar perfil y eliminar cuenta
│   ├── styles/                  # Hojas de estilo CSS modularizadas
│   ├── App.jsx                  # Enrutador principal de la aplicación y estado del usuario
│   └── main.jsx                 # Punto de entrada de React en el DOM
├── .env                         # Variables de entorno del frontend (ignorado por Git)
├── .gitignore                   # Archivos excluidos del repositorio
├── index.html                   # HTML base de la SPA
├── package.json                 # Dependencias y scripts de Vite
└── vite.config.js               # Configuración del empaquetador Vite
```

---

## 6. Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz de `CinetikaFront/`:

```env
VITE_API_URL=http://localhost:4000/api
```

> **Nota importante:** En Vite, cualquier variable de entorno expuesta al cliente debe comenzar con el prefijo `VITE_` y se accede mediante `import.meta.env.VITE_API_URL`.

---

## 7. Estructura y Estandarización de Variables con el Backend

Para asegurar una integración limpia y consistente entre los dos repositorios, los datos del Frontend y el Backend están completamente homologados:

| Concepto | Frontend (`CinetikaFront`) | Backend (`CinetikaBack`) | Descripción y Normalización |
| :--- | :--- | :--- | :--- |
| **Identificador** | `item.id` / `item._id` | `_id` (ObjectId) | El cliente normaliza automáticamente asignando `id = item.id \|\| item._id.toString()`, garantizando compatibilidad con rutas `/audiovisual/:id`. |
| **Correo** | `email` / `correo` | `email` | Los formularios envían `email` a la API. El estado local y los componentes aceptan indistintamente `usuario.email` o `usuario.correo`. |
| **Nombre** | `nombre` | `nombre` | Cadena de texto obligatoria (mínimo 2 caracteres). |
| **Contraseña** | `password` | `password` | Se envía en texto plano mediante HTTPS/HTTP local y el backend la almacena como hash con bcrypt. |
| **Foto de Perfil** | `foto_perfil` | `foto_perfil` | Cadena con URL o DataURL en Base64. Si es nula, se utiliza `/images/default-avatar.png`. |
| **Póster Vertical** | `poster` | `poster` | URL de la imagen en formato vertical para `ContentCard` y `ContentDetail`. |
| **Banner Horizontal** | `banner` | `banner` | URL panorámica utilizada en `FeaturedBanner`. Si no se proporciona, el banner utiliza el póster como fallback. |
| **Géneros** | `generos` | `generos` | Arreglo de strings (ej. `["Acción", "Ciencia Ficción"]`). Se visualizan directamente y se filtran dinámicamente. |
| **Duración** | `duracion` | `duracion` | Cadena de texto (ej. `"117 min"` en películas o `"4 temporadas"` en series). |
| **Video / Tráiler** | `videoUrl` | `videoUrl` | URL multimedia (YouTube, Vimeo, MP4). El reproductor modal del frontend la transforma en iframe interactivo. |
| **Token de Sesión** | `cinetika_token` | `token` | Token JWT devuelto en login y registro, almacenado en `localStorage` y enviado en el header `Authorization: Bearer <token>`. |

---

## 8. Arquitectura de Servicios y Comunicación con la API

El frontend se comunica con el backend mediante una arquitectura modular en `src/services/`:

1. **`api.js` (Cliente HTTP Base):**
   * Centraliza las peticiones `GET`, `POST`, `PUT` y `DELETE` usando `fetch`.
   * Agrega automáticamente el encabezado `Authorization: Bearer <token>` si existe una sesión activa.
   * Procesa respuestas de error devueltas por Zod o Express (`mensaje` o `errores`) para mostrarlas en los formularios.

2. **`authService.js`:**
   * `login(email, password)`: Conecta a `POST /api/auth/login`, guarda el JWT y los datos del usuario en `localStorage`.
   * `register(nombre, email, password)`: Conecta a `POST /api/auth/register` para dar de alta al usuario real en MongoDB Atlas.
   * `logout()`: Limpia las credenciales y el estado local.
   * `getCurrentUser()`: Rehidrata la sesión al recargar la página.

3. **`catalogService.js`:**
   * `getContents()`: Consume `GET /api/catalogo` para obtener películas, series y cortometrajes.
   * `getContentById(id)`: Consume `GET /api/catalogo/:id` para la vista de detalle.
   * `filterByCategory()`, `filterByGenre()` y `selectRandomBanner()`: Funciones utilitarias para la navegación y el Hero Banner.

4. **`profileService.js`:**
   * `updateProfile(datos)`: Conecta a `PUT /api/usuarios/:id` para actualizar nombre, avatar y contraseña.
   * `deleteAccount(id)`: Conecta a `DELETE /api/usuarios/:id` para eliminar la cuenta de MongoDB.

---

## 9. Reproductor de Video Integrado (Modal Player)

En la vista de detalle ([ContentDetail.jsx](src/pages/ContentDetail.jsx)), al hacer clic en **"Ver"** o **"Ver tráiler"**:
* Se analiza el campo `videoUrl`.
* Si es un enlace de **YouTube** (`youtube.com/watch?v=...` o `youtu.be/...`), se transforma a formato embebible con auto-reproducción (`youtube-nocookie.com/embed/...`).
* Si es un enlace de **Vimeo**, se genera el reproductor embebido de Vimeo.
* Si es un archivo directo (`.mp4`, `.webm`), se reproduce en una etiqueta `<video controls autoPlay>`.
* La ventana modal incluye controles de cierre y un enlace para abrir el video externamente si se desea pantalla completa nativa.

---

## 10. Comandos para Ejecutar

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo (puerto 5173 por defecto)
npm run dev

# 3. Compilar el proyecto optimizado para producción
npm run build

# 4. Previsualizar la compilación de producción localmente
npm run preview
```
