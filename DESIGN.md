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

# CV Wizard Open Source - Design System Specification (Stitch Standard)

> **Documento de Diseño UI / Design System (`DESIGN.md`)**  
> Basado en el estándar abierto de **Google Stitch** para agentes de IA y desarrollo web frontend.  
> **Compatibilidad:** Tailwind CSS v4, Astro 5, React 19.

---

## 1. Filosofía de Diseño e Identidad Visual

Inspirado en la experiencia ágil y elegante de **CV Wizard**, el sistema busca maximizar la claridad, eliminar fricciones cognitivas durante la redacción del CV y proyectar máxima profesionalidad tanto en pantalla como en el PDF impreso:

- **Enfoque Split-Screen:** División clara entre el *Área de Trabajo/Edición* (lado izquierdo) y el *Lienzo de Previsualización A4* (lado derecho).
- **Sobriedad y Contraste:** Uso de azules profundos (`#1e40af`) combinados con superficies neutras claras (`#f8fafc`, `#ffffff`) y textos con contraste accesible (WCAG AA).
- **Fidelidad Impresa (Pixel-Perfect A4):** La previsualización replica exactamente las proporciones de una hoja A4 física (`210mm x 297mm`), con sombra de elevación para simular papel real sobre un fondo de estudio neutro.

---

## 2. Paleta de Colores

- **`primary` (`#1e40af`):** Azul zafiro corporativo. Usado en botones de acción principal (ej. "Descargar PDF"), encabezados de sección y acentos principales de plantilla.
- **`primary-hover` (`#1d4ed8`):** Estado *hover* de elementos primarios.
- **`secondary` (`#0284c7`):** Azul cielo usado para badges interactivos, enlaces y acentos secundarios.
- **`surface` (`#ffffff`) y `surface-subtle` (`#f8fafc`):** Fondos de tarjetas de formulario, inputs y fondo general de la app.
- **`surface-sidebar` (`#0f172a`):** Fondo oscuro utilizado en la columna lateral de la plantilla moderna.
- **`neutral-dark` (`#0f172a`):** Color de texto principal de máxima legibilidad.
- **`neutral` (`#64748b`):** Subtítulos, fechas, metadatos y placeholders.
- **`neutral-light` (`#e2e8f0`):** Bordes sutiles entre secciones y separadores.
- **`error` (`#dc2626`):** Acciones destructivas (ej. eliminar experiencia laboral, limpiar formulario).
- **`success` (`#16a34a`):** Indicador de guardado automático activo y confirmaciones.

---

## 3. Tipografía

La tipografía principal de la interfaz es **Inter** (sans-serif moderno, geométrico y altamente legible en pantallas y tamaños reducidos).

Para el contenido del CV, el usuario puede alternar entre 3 familias tipográficas:
1. **Sans-Serif (`Inter` / System Sans):** Ideal para perfiles técnicos, diseño y startups.
2. **Serif (`Merriweather` / Georgia):** Ideal para perfiles ejecutivos, legales, académicos y tradicionales.
3. **Monospace (`JetBrains Mono` / Inconsolata):** Para acentos de código, fechas o perfiles técnicos de ingeniería.

---

## 4. Disposición y Layout (Layout & Spacing)

### 4.1. Escritorio (>= 1024px)
- **Barra Superior (Toolbar):** Altura fija (60px), fondo blanco, borde inferior sutil (`#e2e8f0`), fija en la parte superior con acciones globales (Logo, Descargar PDF, Rellenar Ejemplo, Limpiar, Importar/Exportar).
- **Panel Izquierdo (Editor):** Ancho del 45% al 50%, scroll vertical independiente, acordeones colapsables para mantener ordenada la pantalla.
- **Panel Derecho (Previsualizador):** Ancho del 50% al 55%, fondo neutro de estudio (`#f1f5f9`), centrado vertical y horizontal, con controles de zoom flotantes en la esquina inferior derecha.

### 4.2. Móviles y Tablets (< 1024px)
- Pestañas de alternancia fija: `[ Editar ]` | `[ Vista Previa ]`.

---

## 5. Componentes y Patrones de Interfaz

### 5.1. Botones (Buttons)
- **Primario (`button-primary`):** Fondo azul primario, texto blanco, esquinas redondeadas `md` (8px), padding horizontal 16px, padding vertical 10px, con icono a la izquierda.
- **Secundario (`button-secondary`):** Fondo blanco con borde `neutral-light`, texto `neutral-dark`, hover a `surface-subtle`.
- **Peligro (`button-danger`):** Fondo transparente o rojo suave con texto `error`, para remover entradas de experiencia o educación.

### 5.2. Campos de Entrada (Form Inputs)
- Etiqueta clara arriba (`body-sm`, font-medium).
- Input con fondo blanco, borde `neutral-light` de 1px, transición en `focus:ring-2 focus:ring-primary focus:border-transparent`.

### 5.3. Badges de Nivel de Habilidades (`SkillLevel`)
- Selector visual de 3 estados obligatorios:
  - **`basic`**: Badge con tonalidad neutra/azul clara ("Básico").
  - **`intermediate`**: Badge con tonalidad azul media ("Intermedio").
  - **`advanced`**: Badge con tonalidad azul sólida destacada ("Avanzado").

### 5.4. Hoja A4 del Currículum (`A4 Canvas`)
- Ancho: `210mm` (794px en escala 100%).
- Alto mínimo: `297mm` (1123px en escala 100%).
- Fondo: `#ffffff` inmaculado.
- Sombra: `shadow-2xl` (`0 25px 50px -12px rgba(0, 0, 0, 0.15)`) para simular la textura del papel.

---

## 6. Reglas de Impresión y Exportación (`Print Stylesheet Rules`)

1. Al invocar `window.print()`:
   - Todo contenedor con clase `.no-print` (toolbar, panel editor, controles de zoom, botones) debe forzar `display: none !important`.
   - La hoja `.a4-print-sheet` se posiciona en el origen sin transformaciones ni zoom (`transform: none !important`, `margin: 0 !important`).
   - Se asegura `-webkit-print-color-adjust: exact` para preservar los colores de fondo de las barras laterales y los badges.

---

## 7. Directrices Do's and Don'ts

- **DO:** Mantener los campos del editor agrupados en bloques colapsables (Perfil, Experiencia, etc.) para evitar abrumar al usuario con un formulario infinito.
- **DO:** Mostrar un indicador visual discreto de "Guardado automático" cada vez que se persista en `localStorage`.
- **DON'T:** No insertar marcas de agua, avisos ni atribuciones intrusivas en el canvas del CV o en el PDF impreso.
- **DON'T:** No usar tamaños de fuente menores a 9pt en el CV impreso para garantizar total legibilidad.
