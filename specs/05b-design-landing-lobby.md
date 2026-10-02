# Sistema de Diseño Visual: Landing, Lobby y Modo Oscuro ("CV Fácil")

> **Documento SDD - Fase 2B: Visual Design System**  
> **Estado:** 🟡 En Revisión  
> **Versión:** 2.0.0  
> **Fecha:** 2026-10-02  
> **Complementario a:** [DESIGN.md](../DESIGN.md) (Design Tokens Base)  
> **Autor/Equipo:** CV Fácil Design & Jotace

---

## 1. Filosofía Visual y Experiencia de Usuario

1. **Landing Page:**  
   - **Luminosa y atractiva:** En modo claro, utiliza fondos blancos limpios (`#ffffff` y `#f8fafc`) con un gradiente ambiental sutil en el fondo (*ambient mesh gradient* en tonos azul/índigo translúcidos) que transmite modernidad sin saturar la vista.
   - **Efectos sutiles:** Tarjetas con efecto sutil de cristal (*glassmorphism*: `backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50`) y microinteracciones de elevación al posar el cursor (*hover: -translate-y-1*).
2. **Lobby (Dashboard):**  
   - Inspirado en la elegancia productiva de **ONLYOFFICE**: layout organizado, barra lateral clara, tarjetas superiores de acción rápida y tabla centralizada de documentos recientes.
3. **Editor:**  
   - Interfaz despejada enfocada en el contenido. La selección de plantilla, tipografía y color de acento se traslada a un **menú desplegable flotante en la esquina inferior derecha** de la pantalla (`FloatingStyleDock`), dejando libre el área de edición.
4. **Soporte de Modo Oscuro Nativo y Persistente:**  
   - Integrado de extremo a extremo en las tres páginas (Landing, Lobby, Editor) mediante la clase `dark` en la etiqueta `<html>`, persistiendo la preferencia en `localStorage.getItem('cv_facil_theme')`.

---

## 2. Tokens Semánticos de Color (Modo Claro vs. Modo Oscuro)

| Token Semántico | Modo Claro (Default) | Modo Oscuro (`dark:`) | Uso Previsto |
|---|---|---|---|
| `--color-bg-canvas` | `#f8fafc` (Slate 50) | `#0f172a` (Slate 900) | Fondo principal de la ventana |
| `--color-bg-surface` | `#ffffff` (Blanco puro) | `#1e293b` (Slate 800) | Fondo de tarjetas, tablas y modales |
| `--color-bg-elevated` | `#f1f5f9` (Slate 100) | `#334155` (Slate 700) | Botones secundarios, hover y barras |
| `--color-text-primary` | `#0f172a` (Slate 900) | `#f8fafc` (Slate 50) | Títulos principales y texto de lectura |
| `--color-text-muted` | `#64748b` (Slate 500) | `#94a3b8` (Slate 400) | Subtítulos, metadatos y fechas |
| `--color-border-subtle` | `#e2e8f0` (Slate 200) | `#334155` (Slate 700) | Separadores, bordes de tabla y tarjetas |
| `--color-accent` | `#2563eb` (Blue 600) | `#3b82f6` (Blue 500) | Botones primarios (CTA), enlaces, foco |
| `--color-accent-glow` | `rgba(37,99,235,0.08)` | `rgba(59,130,246,0.18)` | Gradiente ambiental y halo decorativo |
| `--color-danger` | `#ef4444` (Red 500) | `#f87171` (Red 400) | Acción de eliminar documentos |

---

## 3. Especificación Visual de la Landing Page

### Sección 1: Hero Section (Impacto y Claridad)
* **Encabezado:** Título con alto impacto tipográfico (*"Crea tu CV profesional en minutos. 100% libre, sin marcas de agua"*).
* **Fondo sutil:** Círculo difuminado con gradiente radial (`bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-teal-500/10 blur-3xl`) centrado detrás del titular.
* **CTAs destacados:**
  * Botón Primario: *"Comenzar ahora (Gratis)"* (Azul vibrante con icono de flecha hacia la derecha).
  * Botón Secundario: *"Ver en GitHub"* (Ghost con logo de GitHub).
* **Badge de Transparencia:** Etiqueta tipo píldora: *"✨ Soberanía de datos: Guarda en tu propio Google Drive o en tu navegador"*.

### Sección 2: Cuadrícula de Características y Diferenciadores
* 4 tarjetas utilizando el componente abstracto `ActionCard`:
  1. **Privacidad Total (Local-First):** Icono de escudo. Explicación de que no hay base de datos de usuarios.
  2. **Tu Propio Google Drive (BYOS):** Icono de nube segura. Guarda y distribuye desde el móvil.
  3. **Exportación con Control de Peso:** Icono de PDF/balanza. Ajusta a < 2MB para portales ATS.
  4. **Código Abierto y Donaciones:** Icono de corazón. Libre de muros de pago.

### Sección 3: Llamado a la Acción Intermedio y Donaciones
* Bloque destacado con enlaces directos para apoyar el desarrollo:
  * Buy Me a Coffee (amarillo característico).
  * PayPal (azul institucional).
  * Prex & Mercado Pago (badges para la comunidad de LATAM).

---

## 4. Especificación Visual del Lobby (Estilo ONLYOFFICE)

* **Estructura General:**
  * **Barra Lateral Izquierda (Sidebar):** Ancho fijo (240px). Contiene el isotipo "CV Fácil", pestañas *"Mis Currículums"*, *"Plantillas"*, y estado de conexión de Google Drive en la parte inferior.
  * **Área Principal:**
    * **Fila Superior de Acciones Rápidas (3 ActionCards prominentes):**
      - *Crear en Blanco:* Tarjeta con icono de hoja nueva y borde de acento.
      - *Explorar Plantillas:* Tarjeta con icono de paleta/diseño.
      - *Importar JSON o PDF:* Tarjeta con icono de carga/subida.
    * **Tabla de "Documentos Recientes":**
      - Columnas: Nombre del CV, Formato (JSON / PDF), Destino (Local / Google Drive), Última modificación, Acciones (`...` dropdown).
      - Menú contextual de fila: *Abrir*, *Renombrar*, *Duplicar*, *Descargar PDF*, *Eliminar*.

---

## 5. Menú Flotante de Estilos del Editor (`FloatingStyleDock`)

Para maximizar el espacio de escritura y previsualización:
* **Ubicación:** Fijado en la esquina inferior derecha (`fixed bottom-6 right-6 z-40`).
* **Aspecto:** Botón circular o píldora flotante con sombra pronunciada (`shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700`).
* **Contenido al desplegar:**
  - Selector interactivo de las 3 plantillas (Moderna, Clásica, Minimalista).
  - Paleta de 6 colores de acento con previsualización en vivo.
  - Selector de fuente (Inter, JetBrains Mono, Merriweather).
  - Switch para habilitar/deshabilitar la foto de perfil en el encabezado.

---

## 6. Validación de Accesibilidad (WCAG AA)

- Todos los textos principales sobre sus fondos respectivos garantizan una relación de contraste superior a **4.5:1** tanto en modo claro como en modo oscuro.
- Los elementos interactivos cuentan con anillos de foco visibles (`focus-visible:ring-2 focus-visible:ring-blue-500`) para navegación por teclado.
