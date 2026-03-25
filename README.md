# VetLink Frontend Web

![VetLink Logo](public/logo.png)

VetLink Frontend Web es una aplicación web desarrollada en React que sirve como interfaz de usuario para la gestión de turnos, usuarios, veterinarios y mascotas en una clínica veterinaria. Este proyecto utiliza Vite como herramienta de construcción y está diseñado para ser rápido, moderno y fácil de usar.

## Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Usuario de Ejemplo](#usuario)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

## Características

- Gestión de usuarios, veterinarios, mascotas y turnos.
- Interfaz moderna y responsiva.
- Autenticación y autorización con JWT.
- Integración con una API backend para la gestión de datos.
- Uso de componentes reutilizables y diseño modular.

## Requisitos Previos

Tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

## Instalación

1. Clonar este repositorio:

   ```bash
   git clone https://github.com/MikYY8/vetlink-frontend-web.git
   ```

2. Navegar al directorio del proyecto:

   ```bash
   cd vetlink-frontend-web
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

## Uso

1. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

2. Abrir el navegador en la dirección `http://localhost:5173` para ver la aplicación en acción.

## Usuario de ejemplo

*** AUN NO HABILITADO PERDÓN ***

Para ingresar a la aplicación, se requiere iniciar sesión con un usuario registrado. El usuario de ejemplo con permisos de admin es:

Correo: admin@admin.com
Contraseña: admin123

## Estructura del Proyecto

```
vetlink-frontend-web/
├── public/                # Archivos estáticos (imágenes, íconos, etc.)
├── src/                   # Código fuente principal
│   ├── App.jsx            # Componente principal de la aplicación
│   ├── main.jsx           # Punto de entrada de la aplicación
│   ├── assets/            # Recursos como imágenes y fuentes
│   ├── components/        # Componentes reutilizables
│   ├── pages/             # Páginas principales de la aplicación
│   ├── styles/            # Archivos CSS
│   └── utils/             # Utilidades y funciones auxiliares
├── .env                   # Variables de entorno
├── package.json           # Configuración del proyecto y dependencias
├── vite.config.js         # Configuración de Vite
└── eslint.config.js       # Configuración de ESLint
```

## Tecnologías Utilizadas

- **React**: Biblioteca para construir interfaces de usuario.
- **Vite**: Herramienta de construcción rápida para proyectos web modernos.
- **React Router DOM**: Enrutamiento para aplicaciones React.
- **Axios**: Cliente HTTP para realizar solicitudes a la API backend.
- **React Toastify**: Notificaciones elegantes y fáciles de usar.
- **React Select**: Componente para listas desplegables personalizables.
- **use-debounce**: Hook para manejar eventos con debounce.
