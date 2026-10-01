# Especificación de Diseño UI y Sistema de Diseño (Stitch Standard)

> **Documento SDD - Fase 2B: UI & System Design**  
> **Estado:** 🟢 Generado y Validado con Google Stitch  
> **Versión:** 1.0.0  
> **Fecha:** 2026-09-30  
> **Archivo Maestro de Tokens:** [DESIGN.md](../../DESIGN.md)

---

## 1. Integración con Google Stitch y DESIGN.md

En la metodología SDD, el diseño visual y la interfaz de usuario no deben dejarse al azar ni a interpretaciones imprecisas durante la codificación.

Siguiendo el estándar abierto de **Google Stitch** (`@google/design.md`), el archivo maestro [**`DESIGN.md`**](../../DESIGN.md) ubicado en la raíz del proyecto define de forma ejecutable:
1. **Tokens de Diseño (YAML Frontmatter):**
   - 11 tokens de color (azul corporativo CV Wizard, superficies neutras, estados de éxito y alerta).
   - 7 escalas tipográficas con tamaños, pesos y alturas de línea (Inter).
   - 5 radios de curvatura (`radius-sm` a `radius-full`).
   - 6 tokens de espaciado basados en múltiplos de 4px/8px.
2. **Exportación Automatizada a Tailwind CSS:**
   - Compilado nativo mediante el comando:
     ```bash
     npx @google/design.md export DESIGN.md --format css-tailwind
     ```
3. **Validación de Accesibilidad y Calidad:**
   - Validado contra el linter oficial con **0 errores y 0 advertencias**.

---

## 2. Componentes de UI Clave Definidos

- **Barra de Herramientas Superior (`Toolbar`):** Acciones globales fijas con contraste visual claro.
- **Split-Screen Adaptativo:** 50% Editor modular con acordeones colapsables, 50% Lienzo A4 con fondo neutro de estudio.
- **Selector de Nivel de Habilidad (`SkillLevel`):** Badges interactivos para los 3 estados (`basic`, `intermediate`, `advanced`).
- **Contenedor A4 de Alta Fidelidad:** Proporciones físicas de 210mm x 297mm con controles de zoom (50% a 100%).
- **Print Engine:** Reglas de `@media print` para exportar PDF vectorial puro sin marcas de agua.
