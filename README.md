
# ⚽Fanstasy Draft

## Índice

- [Introducción](#introducción)
- [💻 Tecnologías](#-tecnologías)
    - [Plugins de Gradle](#plugins-de-gradle)
    - [Configuración de Android](#configuración-de-android)
    - [Dependencias clave](#dependencias-clave)
- [🔒 Autenticación y Gestión de Tokens](#-autenticación-y-gestión-de-tokens)
- [Flujo de UI / ViewModel](#flujo-de-ui--viewmodel)
- [🚀 Navegación](#-navegación)
    - [1. Declaración de rutas (`Routes`)](#1-declaración-de-rutas-routes)
    - [2. Tipos de navegación](#2-tipos-de-navegación)
        - [a) Navegación por clics](#a-navegación-por-clics)
        - [b) Navegación con argumentos](#b-navegación-con-argumentos)
        - [c) Control del back-stack](#c-control-del-back-stack)
    - [3. Barra de navegación (`NavbarView`)](#3-barra-de-navegación-navbarview)
    - [Cuándo mostrar la Navbar](#cuándo-mostrar-la-navbar)
- [🎨 Home](#-home)
- [🏗️ Reparto de responsabilidades (Home)](#️-reparto-de-responsabilidades-home)
- [🚀 Acciones disponibles desde Home](#️-acciones-disponibles-desde-home)
- [🎨 LigaView](#-ligaview)
- [🏗️ Reparto de responsabilidades (LigaView)](#️-reparto-de-responsabilidades-ligaview)
- [👤 UserSelfScreen / Perfil](#-userselfscreen--perfil)
- [👥 UserDraftView](#-userdraftview)
- [⚽️ DraftScreen](#️-draftscreen)
- [🎮 Jugadores](#🎮-jugadores)
- [🎯 Detalle de Jugador](#🎯-detalle-de-jugador)
- [🔔 Notifications](#-notifications)
- [⚙️ Settings](#️-settings)
- [🔗 Módulo API / Retrofit – Resumen](#🔗-módulo-api--retrofit--resumen)
- [🎨 Color Reference](#-color-reference)
- [👥 Authors](#-authors)


Fantasy Draft: El Fantasy Fútbol con Draft Semanal es un proyecto académico desarrollado por dos estudiantes de DAM (Desarrollo de Aplicaciones Multiplataforma). Se trata de la propuesta final de su módulo de Desarrollo de Aplicaciones, en la que debían diseñar y programar una aplicación completa, desde la interfaz hasta la lógica de negocio y la conexión con la base de datos.

La idea principal de la app es ofrecer una experiencia de Fantasy Fútbol más dinámica: en lugar de gestionar un equipo fijo toda la temporada, cada semana los usuarios participan en un draft para seleccionar a sus 11 futbolistas. A través de un sistema de “puntos de estrellas” , cada jugador elegirá estratégicamente su alineación semanal y competirá en ligas personalizadas contra otros usuarios. Todo ello desde una plataforma multiplataforma (web y móvil) sincronizada por correo electrónico.


## 💻Tecnologias
### Plugins de Gradle
```groovy
plugins {
    alias(libs.plugins.android.application)       // com.android.application (AGP 8.8.0)
    alias(libs.plugins.kotlin.android)            // org.jetbrains.kotlin.android (Kotlin 2.0.0)
    alias(libs.plugins.kotlin.compose)            // org.jetbrains.kotlin.plugin.compose (Kotlin 2.0.0)
    id("com.google.gms.google-services")          // Google Services (Firebase)
}
```
### Configuración del proyecto

// next.config.js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'], // para cargar imágenes externas
  },
};

module.exports = nextConfig;

// jsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@components/*": ["components/*"],
      "@lib/*": ["lib/*"]
    }
  }
}

### Dependencias clave

- **Jetpack Compose**

    - @mui/material

    - @emotion/react y @emotion/styled

    - lucide-react

- **Routing**

    - next/router (para navegación manual)

    - App Router con /app folder (opcional, en Next.js 13+)

- **Networking**

    - fetch() nativo de JS/Next

    - axios – para consumir APIs

- **Imágenes & Animaciones**

    - next/image – optimización automática de imágenes

    - framer-motion – animaciones fluidas

- **Persistencia y Background**

    - localforage – persistencia local (similar a DataStore)

    - `androidx.work:work-runtime-ktx:2.9.0`


## 🔒 Autenticación y Gestión de Tokens

Nuestro cliente Web usa las cookies y JWT para:

1. **Endpoints clave**
    - `POST /api/v1/auth/login` → **login**
    - `POST /api/v1/auth/signup` → **registro**
    - `POST /api/v1/auth/google/web/token` → **OAuth Google**
    - `POST /api/v1/auth/logout` → **logout**

2. **Almacenamiento seguro de JWT**
    - httpOnly cookies servidas desde el backend. Más seguras sin acceso desde JS y que resisten a XSS.
    - Si no fuera por las cookies se podria dejar a localStorage o sessionStorage.

3. **Intercepción de peticiones**
// api.ts
import axios from "axios";
import { TokenManager } from "./TokenManager";

const api = axios.create({
  baseURL: "https://tu-backend.com/api",
});

api.interceptors.request.use((config) => {
  const token = TokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

##Flujo de UI / ViewModel

- **LoginViewModel** / **RegisterEmailViewModel** llaman a `authRepo.login(...)` o `.register(...)`.

- El repositorio guarda el JWT, activa navegación a la pantalla protegida.

- Para Google OAuth:

- Usamos o gapi o @react-oauth/google, quedándo guardado el idToken donde las credenciales.

5\. **Uso de token en peticiones**

- Tras el login, cualquier llamada a servicios protegidos (p. ej. perfil de usuario) lleva el header `Authorization: Bearer <token>`.

- Si el token expira o no existe, el backend responderá 401 y debes redirigir al login.
## 🚀 Navegación

### 📖 1. Declaración de rutas (`Routes`)

- **Rutas sin parámetros**:

Són las mas simples como ahora /home o /profile

- **Rutas con parámetros**:

Permiten pasar datos por la URL como por ejemplo /liga/123

### 🔄 2. Tipos de navegación

#### a) Navegación por clics

Botones o elementos interactivos, íconos, tarjetas... Usan eventos de clic para redirigir al usuario a otra página. Generalmente con link pero tambien hay .push

#### b) Navegación con argumentos

Cuando una ruta necesita parámetros como ahora el ID de una liga o usuario, se incluyen directamente en la url. La lógica del componente que representa se encarga de leer los parámetros al cargar.

#### c) Control del back-stack

La web tiene su propio historial de navegación gestionado por el navegador. Para evitar que el usuario regrese a ciertas pantallas, se puede reemplazar la ruta actual o redirigir sin agregar al historial.

### 📱 3. Barra de navegación (`NavbarView`)

En aplicaciones web tipo SPA, la barra de navegación se muestra como algo fijo en determinadas pasntallas, normalmente en el header o en el footer.

**Flujo de usuario típico**:

1\. Pulsa **Inicio** → `navController.navigate("home_loged")`

2\. Pulsa **Perfil** → `navController.navigate("user_self")`

3\. Pulsar **Jugadores**, **Notificaciones**, **Ajustes**, etc., llama a su respectiva ruta.

---

### 🧭 Cuándo mostrar la Navbar

Se muestra de forma predeterminada una vez inicias sesión y ya permanece en la página.

## 🎨 Home_unlog

### Header

- Un bloque con el logo de la app y el título **"FantasyDraft"** sobre un degradado horizontal.

- **Botones**:  

  - **COMENZAR A JUGAR** (te envia al login)  

## Próxima jornada

- Muestra los partidos que se esan disputando, indicando quien ha ganado.

## Jugadores con mas puntos

- Muestra un ranking con los 20 jugadores que tienen más puntuación en la liga.

## 🚀 Acciones disponibles desde **Home**

- **Iniciar sesión**: Iniciar sesión

- **Ver jornada**: consultar partidos de la jornada actual  

- **Refrescar datos**: recarga automática al entrar o tras cada acción

- **Top 20 jugadores**: Mostrar los 20 jugadores que más puntos han obtenido en la liga.


##  🎨 LigaView

### 1. Header
- **Burger Menu** (icono) que abre el burger menu.

- **Título**: nombre de la liga a laizquierda arriba de la liga.

- **Icono de la liga**: Imagen de la liga a la izquierda del titulo.

- **Botón abandonar liga**: Para abandonar liga, en la parte superior derecha de la página, altura del título.

- **Código de liga**: Con a su derecha un icono que nos permite copiar el código.

### 2. Ranking de usuarios
- **Lista vertical** de usuarios ordenados por posición (🥇🥈🥉):
    - **Nombre de usuario** y **puntos** de la jornada o acumulados.


### 3. Diálogos modales
- **Abandonar liga**: Para abandonar la liga.
- **Editar liga**: Poder editar tanto el nombre de liga como su imagen.         //Solo para administrador de la liga
- **Kick user**: Para poder expulsar a algun usuario siendo el administrador.   //Solo para administrador de la liga

### 4. Footer
- **Puntos máximos**: Muestra los puntos máximos que tiene el que va primero.
- **Media de puntos**: Muestra la media de puntos totales de la liga.
- **Total de jugadores**: Muestra el total de jugadores que hay en la liga.

  
## 👤 Draft view

### 1. Header
- **Nombre de usuario**: Centrado a la izquierda
- **Estado del draft**: Texto que muestra si estña activo en curso o finalizado.

### 2. Vista del estado del draft
- **No hay draft creado**: No tiene ningun draft y te muestra las formaciones y un botón para crear draft.
- **Draft en preparacion**: Te envia a continuar el draft donde lo dejaste.
- **Draft finalizado**: Te muestra los jugadores que se han seleccionado con su formación.

### 3. Crear draft
- **Formación**: Se muestran tantas posiciones por linea del campo.
- **Targeta de jugador**: Muestra la foto, nombre, el equipo , las estrellas del jugador y los puntos conseguidos hasta el momento.
- **Guardar draft**: El botón se vuelve clicable una vez detecta que el draft ha finalizado.

### 4. Visualizar draft finalizado:
- **Formación**: Se muestran tantas posiciones por linea del campo.
- **Jugador**: Muestra el color de segun cuantas estrellas tiene, el nombre, la imagen, y cuantos puntos lleva hasta el momento.


### 5. Componentes
- **editor-formacion** Gestiona acciones sobre jugadores ya colocados en la formación del usuario.
- **formacion-editor** Feedback de confirmación tras guardar o modificar una formación.
- **jugador-seleccion**: Muestra un spinner de carga semitransparente sobre la pantalla.
- **seleccion-jugador**: Permite al usuario elegir un jugador para su formación.
- **seleccion-formacion**: Modal para seleccionar el esquema táctico o formación del equipo (por ejemplo: 4-4-2, 3-5-2, etc.).
- **selector-jugador**: Buscador o selector filtrado de jugadores.



## ⚽️ Home logged

### 1. Header
- **Burger Menu** (icono) que abre el burger menu.
- Logo de la app y título "FantasyDraft" sobre un degradado horizontal (igual que en Home_unlog).

### 2. Burger menu
- Sección que muestra un listado horizontal o en grid de las ligas en las que participa el usuario.
- Si no hay ligas, aparece un mensaje como: "Todavía no estás en ninguna liga." con un botón para crear o unirse a una.
- **Añadir liga**: Añade ligas, uniendose o creandola
- **BackOffice**: Gestión de usuarios.
- **Cerrar sesion**: Abandonar la sesión
- **Contacto**: Ponerse en contacto con los creadores a traves de un form y el problema
- **Settings icon**: Para acceder a la página de ajustes

### 3. Lista de notificaciones
- Cada `NotificationItem` recibe un objeto `Notifications` y muestra:
   - **Icono**: `Notifications`, mostrando un icono u otro según tipo de mensaje.
   - **Texto enriquecido**:
            - Se extrae tipo, usuario y liga/fecha.

## 🎮 Jugadores

### 1. Filtros
- **Equipo**: Botones con cada equipo de la liga.
- **Búsqueda**: campo de texto para filtrar por nombre.

### 2. Lista de jugadores
- Scroll vertical de tarjetas (**PlayerCard**) con:
  - Foto circular
  - Nombre y equipo
  - Puntos totales
  - Ver puntos por jornada
- Al clicar sobre ver puntos por jornada nos lleva abre un popup de frafana con su histórico de puntos y un gráfico.

## 🚀 Acciones disponibles

- **Ver detalle**: Clicar sobre ver puntos de la jornada
- **Filtrar por equipo**: clica un boton del equipo correspondiente
- **Buscar por nombre**: teclea en el campo de búsqueda

## ⚙️ Settings

### 1. Targetas de ajustes
- **Equipo**: Visualizar nombre e imagen de perfil
- **Gestion de ligas**: Visualizar ligas
- **Usuario**: Información acerca del usuario
- **Interficie**: Información acerca de la app
  
### 2. Equipo
- **Nombre**: Muestra el nombre del equipo actual y permite cambiarlo.
- **Imagen**: Permite cambiar la imagen del jugador siempre que sea png

### 3. Gestion de ligas
- **Lista de ligas**: Permite ver una lista de ligas en las que estás.
  
### 4. Usuario
- **Nombre**: Nombre del usuario, se puede cambiar
- **Fecha de nacimiento**: Fecha de nacimiento introducida
- **Guardar cambios**:  Botón para guardar cambios en fecha y nombre
- **Email**: Correo, no se puede cambiar
- **Password actual**: Introducir la contraseña actual
- **New password**: Introducir nueva contraseña si la quieres cambiar
- **Repeat new password**: Introducir la misma nueva contraseña que la previa
- **Delete account**: Botón para eliminar la cuenta siempre que el correo sea el mismo que el que se introdujo
- **Cambiar password**: Botón para cambiar contraseña, revisa que se los campos sean correctos

### 5. Interficie
- **Contacto**: Muestra email, teléfono, calle, y horario para atender
- **Política de privacidad**: Información sobre los datos y demás
- **Sobre nosotross**: Información acerca de nuestra empresa
- **Conoce nuestra API**: Información y requisitos de nuestra API
- **Cerrar sesión**: Boton para cerrar sesión


## 🚀 Acciones disponibles desde **Settings**

- **Sobre nosotros**: Abrir un harmonioc menu para mostrar info sobre nosotros.
- **Leer política**: Abrir un harmonioc menu para mostrar info de la api.
- **Ver detalles de la API**: Abrir un harmonioc menu para mostrar info de la api.
- **Información de contacto**: Abrir un harmonic menú para mostrar información de contacto.
- **Cerrar sesión**: invocar logout y volver a la pantalla de inicio.
- **Información de usuarios**: abrir modal con texto legal.


## 🔗 Módulo API / Retrofit – Resumen

Este módulo agrupa toda la configuración de red de la aplicación:

1. **RetrofitClient**
    - Define la URL base (`BASE_URL`) y el cliente HTTP con un **AuthInterceptor** que inyecta el token en cada petición.
    - Expone instancias perezosas (`lazy`) de todos los servicios Retrofit:
        - Autenticación (`AuthService`)
        - Ligas (`LigaService`)
        - Usuario / perfil (`UserService`)
        - Drafts (`DraftService`)
        - Jugadores (`PlayerService`)
        - Equipos (`TeamService`)
        - Notificaciones (`NotificationsService`)
        - Contacto (`ContactService`)
    - También construye repositorios que envuelven estos servicios (p. ej. `PlayerRepository`, `TeamRepository`).

2. **Interfaces de servicio**  
   Cada `interface` define los endpoints HTTP con anotaciones Retrofit:
    - Métodos `@GET`, `@POST`, `@PUT`, `@DELETE`, `@Multipart`
    - Parámetros en ruta (`@Path`), consulta (`@Query`) o cuerpo (`@Body`).
    - Respuestas tipadas como `Response<Modelo>` para manejar errores/excepciones.


## 🎨 Color Reference


| Color                   | Hex                                                              |
| ----------------------- | ---------------------------------------------------------------- |
| **PrimaryColor**        | #082FB9 |
| **SecondaryColor**      | #021149 |
| **TertiaryColor**       | #94AAFA |
| **BackgroundLight**     | #F5F5F5 |
| **SurfaceVariantLight** | #E0E0E0 |
| **OnSurfaceVariantLight** | #333333|
| **OutlineLight**        | #BBBBBB |

---
## 👥 Authors

- [@Roger Bustos](https://github.com/rogerbj43)
- [@Nico Vehi](https://github.com/yzwnike)
