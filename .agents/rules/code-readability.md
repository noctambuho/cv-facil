# Regla de Calidad de Código y Legibilidad (SDD)

Esta regla define los estándares mandatorios de arquitectura, modularidad y estilo de comentarios para todo código generado o modificado por IA en este repositorio.

---

## 1. Arquitectura de Tres Capas
1. **`src/domain/` (Lógica Pura):**
   - Funciones deterministas sin efectos secundarios (I/O, DOM, timers, fetch).
   - Prohibido importar dependencias de React, Astro o servicios en `domain/`.
   - Cobertura de tests unitarios obligatoria con Vitest.
2. **`src/services/` (Efectos y Persistencia):**
   - Agrupa interactuadores externos: APIs de red, localStorage, cookies, Canvas, exportación PDF y DOM APIs.
3. **`src/components/` (Presentación):**
   - Componentes declarativos. No deben contener transformaciones complejas de datos ni lógica de red directa.
   - Límite máximo orientativo: **~150 a 200 líneas de código por archivo**. Si excede, dividir en subcomponentes o extraer lógica a hooks.

---

## 2. Taxonomía Obligatoria de Comentarios Etiquetados
Todo símbolo exportado, constante de módulo, hook o estado React debe encabezarse con una etiqueta en corchetes:

- `[CONTRATO]`: Definición de tipo o interfaz (`type`, `interface`).
- `[CLASE]`: Definición de clase (`class`).
- `[INSTANCIA]`: Instanciación concreta de una clase u objeto singleton.
- `[CONSTANTE]`: Valores inmutables o catálogos globales (`const`).
- `[PURA]`: Función sin efectos secundarios (`function` o `arrow function`).
- `[EFECTO]`: Función con efectos secundarios (DOM, storage, red, timeout).
- `[HOOK]`: Hook personalizado de React (`use...`).
- `[COMPONENTE]`: Componente de presentación React (`React.FC`).
- `[ISLA]`: Componente raíz hidratado por Astro.
- `[ESTADO]`: Variable de estado interna de un componente (`useState`, `useReducer`).

---

## 3. Seguridad Inviolable
- Todo enlace externo debe renderizarse con `rel="noopener noreferrer"`.
- Los datos externos (importación JSON, API responses) deben normalizarse con `normalizeCVData`.
- Se prohíbe el uso de `javascript:`, `data:` (salvo imágenes base64 validadas) y la manipulación insegura del DOM.
