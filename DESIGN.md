---
version: alpha
name: CV Wizard Open Source Design System
colors:
  primary: "#1e40af"
  primary-hover: "#1d4ed8"
  secondary: "#0284c7"
  surface: "#ffffff"
  surface-subtle: "#f8fafc"
  surface-sidebar: "#0f172a"
  neutral: "#64748b"
  neutral-dark: "#0f172a"
  neutral-light: "#e2e8f0"
  error: "#dc2626"
  success: "#16a34a"
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.05em
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
---

# CV Wizard / CV Fácil - Design System Specification (Stitch Standard)

> **Documento de Diseño UI / Design System (`DESIGN.md`)**  
> Basado en el estándar abierto de **Google Stitch** para agentes de IA y desarrollo web frontend (*Strategy: The Editorial Architect / Lexicon Slate*).  
> **Compatibilidad:** Tailwind CSS v4, Astro 5, React 19.

---

## 1. Filosofía de Diseño e Identidad Visual ("The Digital Curator")

El sistema trasciende el concepto tradicional de "constructor de CV" y abraza la filosofía de **El Curador Digital**:
- **Tratamiento Editorial de Lujo:** Cada currículum es tratado como una pieza de arte tipográfico y profesionalismo ejecutivo.
- **Asimetría Intencional:** En la landing y el espacio de trabajo, combinamos alta densidad de valor (credenciales, métricas ATS, notificaciones de éxito) frente a lienzos amplios y aireados.
- **Autoridad y Contraste Dual:** Uso de tipografía Serif (`IBM Plex Serif` / `Merriweather`) como ancla de prestigio y autoridad frente a la claridad funcional y técnica de `Inter` / `IBM Plex Sans`.
- **Sensación de Inmersión y Confianza:** Integración de micro-interacciones sutiles (compatibilidad ATS 98%, notificaciones de entrevista recibida, prueba social con avatares reales) para que el postulante sienta que esta herramienta es su diferencial decisivo para conseguir trabajo.

---

## 2. Paleta de Colores y Regla "No-Line"

### 2.1. Colores Principales
- **`primary` (`#3525cd` / `#1e40af`):** Azul zafiro y púrpura corporativo profundo.
- **`primary-gradient` (`from-indigo-600 via-blue-600 to-violet-600`):** Gradiente insignia para CTAs de alta conversión y elementos destacados.
- **`surface` (`#f8f9ff`):** Fondo base de la aplicación.
- **`surface-container-low` (`#eff4ff`):** Secciones de fondo suave para crear separación sin usar bordes duros.
- **`surface-container-lowest` (`#ffffff`):** Tarjetas interactivas y lienzo A4 del CV.
- **`surface-sidebar` (`#0f172a`):** Fondo oscuro utilizado en la columna lateral de la plantilla moderna y banners de cierre.

### 2.2. La Regla del "No-Line" (Stitch Principle)
- Se prohíbe el uso de bordes sólidos gruesos de 1px para delimitar secciones.
- Los límites se crean de manera natural mediante **desplazamientos tonales de superficie** (`surface-container-low` sobre `surface`) y **espaciado negativo**.
- Si se requiere contención por accesibilidad, se utiliza un "borde fantasma" (*Ghost Border*) con `border-slate-200/80` o `border-white/20` con baja opacidad.

---

## 3. Tipografía

1. **Titulares Editoriales (`IBM Plex Serif` / `Merriweather`):**
   - Transmite tradición de alta gama, autoridad y seriedad similar a publicaciones de prestigio internacional.
2. **Interfaz y Datos Técnicos (`Inter` / `IBM Plex Sans`):**
   - Fuente funcional, nítida y geométrica para inputs, etiquetas, chips de habilidades y metadatos.
3. **Monospace (`JetBrains Mono`):**
   - Para acentos técnicos, fechas y credenciales de ingeniería.

---

## 4. Elevación y Luminancia Ambiental

En lugar de sombras grises duras, se aplica **Luminancia Ambiental**:
- Sombras difusas y suaves coloreadas por el tono de la superficie (`box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.08)`).
- Gradientes en malla (*mesh gradients*) difuminados con `blur-3xl` en el fondo.
- Vidrio esmerilado (*glassmorphism*) con `backdrop-filter: blur(14px)` en barras flotantes y tarjetas de notificación.

---

## 5. Directrices Do's and Don'ts

- **DO:** Mostrar métricas tangibles de éxito (compatibilidad ATS 98%, ratio de entrevistas 3.2x) que refuercen la confianza del usuario.
- **DO:** Mantener la previsualización A4 fiel a escala física (`210mm x 297mm`) con exportación en PDF vectorial < 2MB.
- **DON'T:** Nunca insertar marcas de agua ni muros de pago sorpresivos al descargar.
- **DON'T:** No usar bordes oscuros duros de 1px que saturen visualmente la interfaz.

