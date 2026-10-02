# CV Fácil v2.0 📄✨

> **Generador de Currículum Vitae Profesional, Gratuito, Sin Marcas de Agua y Local-First.**  
> Diseñado bajo estándares internacionales ATS y principios de arquitectura limpia.

[![Astro](https://img.shields.io/badge/Astro-5.3-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Descripción General

**CV Fácil** es una aplicación web moderna orientada a la creación y gestión ágil de currículums vitae en formato estándar A4. Nació con una premisa fundamental: **soberanía total del usuario sobre sus datos**. La aplicación no requiere registro en servidores externos, no almacena información sensible en bases de datos intermediarias y permite exportar documentos PDF vectoriales ultra-ligeros (< 2 MB) 100% compatibles con filtros de contratación ATS (*Applicant Tracking Systems*).

---

## 🚀 Características Principales

- **Editor en Tiempo Real Split-Screen**: Formularios modulares con previsualización en vivo A4 y navegación fluida adaptable a dispositivos móviles.
- **Optimizado para Filtros ATS**: Estructura editorial suiza, jerarquía tipográfica limpia y metadatos legibles por algoritmos de escaneo laboral (Workday, Greenhouse, Taleo).
- **Exportación Dual Vectorial & Respaldo JSON**:
  - Descarga directa de PDF vectorial de alta fidelidad vía `@react-pdf/renderer` (< 2MB).
  - Respaldo de estructura completa en formato `.json` descargable e importable.
- **Soberanía y Almacenamiento Híbrido (BYOS)**:
  - **Modo Invitado (Local-First)**: Persistencia transparente en el `localStorage` del navegador con autoguardado debounced (500 ms).
  - **Google Drive (Bring Your Own Storage)**: Sincronización directa y segura con la cuenta de Google Drive del usuario sin backend intermediario.
- **Seguridad Robusta Integrada (Hardening)**:
  - Validación de magic bytes en imágenes y compresión rasterizada en Canvas para neutralizar vectores maliciosos (CWE-434 / CWE-79).
  - Sanitización estricta de parámetros en URLs e identificadores de documento (CWE-20).
  - Bloqueo de esquemas inseguros en enlaces externos (`javascript:`, `data:`).
- **Soporte de Tema Claro / Oscuro**: Adaptabilidad visual completa con tokens semánticos de diseño.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Framework Base** | [Astro v5](https://astro.build/) | Generación Estática (SSG) de alto rendimiento y arquitectura de Islas. |
| **Biblioteca UI** | [React 19](https://react.dev/) | Islas interactivas para el Editor, Lobby, Previsualizador y Modales. |
| **Estilos & Diseño** | [Tailwind CSS v4](https://tailwindcss.com/) | Motor CSS de última generación con Vite plugin y tokens de diseño. |
| **Motor PDF** | [@react-pdf/renderer](https://react-pdf.org/) | Compilación de PDFs vectoriales con tipografías embebidas y peso < 2MB. |
| **Iconografía** | [Lucide React](https://lucide.dev/) | Iconos SVG optimizados y accesibles para la interfaz. |
| **Tipado Estático** | [TypeScript 5.7](https://www.typescriptlang.org/) | Validación estricta en tiempo de desarrollo en todo el árbol de código. |

---

## 🏛️ Arquitectura del Proyecto

El proyecto sigue una estructura inspirada en **Clean Architecture**, con estricta separación de responsabilidades (SRP) y alta cohesión modular:

```text
src/
├── types/                     # Entidades de Dominio y Contratos
│   ├── cv.ts                  # Modelo de datos del CV, perfiles y plantillas
│   └── storage.ts             # Metadatos de almacenamiento y sesión Drive
│
├── services/                  # Capa de Servicios y Casos de Uso
│   └── storage/               # Patrón Adaptador para persistencia
│       ├── IStorageAdapter.ts # Interfaz común de operaciones CRUD
│       ├── LocalStorageAdapter.ts # Adaptador Local-First (Modo Invitado)
│       ├── GoogleDriveAdapter.ts  # Adaptador Google Drive (BYOS)
│       └── index.ts           # Factoría unificada de almacenamiento
│
├── utils/                     # Utilidades Transversales y Puras
│   ├── security.ts            # Sanitización (CWE-20/79/434), IDs seguros y Canvas
│   ├── routes.ts              # Generador de rutas canónicas considerando BASE_URL
│   ├── storage.ts             # Exportador de respaldos JSON (responsabilidad única)
│   ├── pdfExport.ts           # Perfiles de calidad y cálculo de peso PDF
│   ├── pdfRenderer.ts         # Registro tipográfico y renderizado a Blob
│   └── theme.ts               # Conmutador de modo claro/oscuro
│
├── components/                # Capa de Presentación (UI)
│   ├── common/                # Componentes Compartidos
│   │   ├── layout/            # BaseLayout, Navbar, UnifiedFooter, SEO, ThemeToggle
│   │   └── primitives/        # Primitivos accesibles (Button, Modal, Input, Dropdown)
│   ├── landing/               # Secciones de la Landing Page pública (Astro)
│   ├── lobby/                 # Dashboard de gestión de documentos (LobbyDashboard)
│   ├── editor/                # Subsistema del Editor en Vivo
│   │   ├── hooks/             # Custom Hooks (useEditorDocument, useAutoSave)
│   │   ├── sections/          # Subformularios modulares (Profile, Experience, etc.)
│   │   ├── EditorToolbar.tsx  # Barra superior con renombrado y estado de guardado
│   │   ├── FloatingStyleDock.tsx # Menú flotante de estilos, paletas y tipografía
│   │   ├── ExportModal.tsx    # Modal de descarga de PDF y respaldo JSON
│   │   └── ResumeEditorApp.tsx# Orquestador principal del split-screen
│   ├── preview/               # Previsualización HTML reactiva (Classic, Modern, Minimal)
│   └── pdf/                   # Plantillas vectoriales nativas para @react-pdf/renderer
│
└── pages/                     # Rutas y Entrypoints SSG (Astro)
    ├── index.astro            # Landing Page con redirección inteligente (US-07 Criterio 7.3)
    ├── lobby.astro            # Panel de control de documentos (/lobby)
    └── editor.astro           # Editor interactivo (/editor?id=...)
```

---

## 🧭 Flujo de Navegación y Rutas (Estrategia Dashboard-First)

Para garantizar la mejor experiencia de usuario en aplicaciones de productividad:
1. **Acceso Inicial**: Un visitante nuevo ingresa a la raíz `/` y visualiza la Landing Page.
2. **Redirección Inteligente (US-07 Criterio 7.3)**: Cuando un usuario ya posee documentos o sesión activa (`cv_facil_active_session`), el acceso a la raíz `/` lo conduce automáticamente al Lobby (`/lobby`), evitando pasos intermedios.
3. **Isotipo "CV Fácil" en Navbar**:
   - **Dentro de la app (`/lobby` o `/editor`)**: El clic en el logo conduce directamente a `/lobby` (área de trabajo central).
   - **En la Landing Page**: Conduce a la raíz `/`.
4. **Enlace "Inicio"**: Desde dentro de la app, el enlace "Inicio" utiliza la ruta canónica `/?landing=true` para permitir al usuario explorar voluntariamente la presentación institucional sin ser expulsado por la redirección automática.

---

## ⚙️ Comandos y Scripts

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción (SSG estático en /dist)
npm run build

# Previsualizar el build de producción localmente
npm run preview

# Verificación de tipos y diagnóstico Astro / TypeScript
npx astro check
npx tsc --noEmit
```

---

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.
