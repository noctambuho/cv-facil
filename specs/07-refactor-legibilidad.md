# Especificación Técnica y Tareas: Refactor de Legibilidad y Arquitectura (v2.1.0)

> **Documento SDD - Fases 2 y 3: Architecture & Tasks**  
> **Estado:** 🟢 Completado y Verificado  
> **Fecha:** 2026-10-03  
> **Trazabilidad:** [04-especificacion-cv-facil-v2.md](04-especificacion-cv-facil-v2.md) | [05-arquitectura-cv-facil-v2.md](05-arquitectura-cv-facil-v2.md)

---

## 1. Objetivos y Principios Arquitectónicos
1. **Regla de 3 Capas Estricta:**
   - `src/domain/`: Lógica pura, determinista, agnóstica de frameworks/DOM. 100% testeable con Vitest.
   - `src/services/`: Efectos secundarios (I/O, Google Drive API, localStorage, Canvas/DOM, descargas).
   - `src/components/`: Vistas declarativas (máx. ~150-200 líneas por archivo).
2. **Convención de Comentarios Etiquetados:**
   `[CONTRATO]`, `[CLASE]`, `[INSTANCIA]`, `[CONSTANTE]`, `[PURA]`, `[EFECTO]`, `[HOOK]`, `[COMPONENTE]`, `[ISLA]`, `[ESTADO]`.
3. **Hardening de Seguridad (CWE-79 / CWE-434):**
   Neutralizar vectores de inyección XSS en importación de JSON mediante normalizador centralizado y atributos `rel="noopener noreferrer"`.
4. **Unificación Visual:**
   Nivel "Intermedio" y separador "—" estandarizados entre plantillas.
5. **Ampliación de Plantillas (Backlog Investigación):**
   Investigar e inventariar plantillas de CV Wizard para expandir catálogo en fases posteriores.

---

## 2. Mapa de Estructura de Directorios

```
src/
├── types/              # [CONTRATO] cv.ts, storage.ts, import.ts
├── domain/             # [PURA] catalogs.ts, cvFormatters.ts, listOps.ts, cvNormalizer.ts, exportEstimate.ts, security.ts
├── services/           # [EFECTO]
│   ├── storage/        # IStorageAdapter, LocalStorageAdapter, GoogleDriveAdapter, driveHttp, driveTokenStore
│   ├── pdf/            # pdfRenderer.ts, pdfFonts.ts
│   └── browser/        # download.ts, navigation.ts, theme.ts, image.ts
├── components/
│   ├── common/         # Primitivas, Layout, cn.ts, useClickOutside.ts
│   ├── editor/         # Sections, fields/ (EditorField, ItemCard), hooks/ (useExportWorkflow)
│   ├── preview/        # ResumeViewer (subcomponentes/hooks), templates HTML
│   ├── pdf/            # ResumePdfDocument, templates PDF, styles/
│   ├── lobby/          # Dashboard, modales, hooks/ (useDocumentLibrary, useDriveConnection)
│   └── landing/        # Secciones de Landing Page
tests/
└── domain/             # Tests unitarios con Vitest
```

---

## 3. Desglose de Tareas Atómicas (Milestones)

- [x] **TASK-7.0: Gobernanza SDD y Regla de Legibilidad**
  - Crear `specs/07-refactor-legibilidad.md` y `.agents/rules/code-readability.md`.
  - DoD: Reglas y especificación sincronizadas en repositorio.
- [x] **TASK-7.1: Capa de Dominio y Tests Unitarios (Vitest)**
  - Instalar `vitest`.
  - Crear `src/types/import.ts`, `src/domain/security.ts`, `src/domain/catalogs.ts`, `src/domain/cvFormatters.ts`, `src/domain/listOps.ts`, `src/domain/cvNormalizer.ts`, `src/domain/exportEstimate.ts`.
  - Crear tests unitarios en `tests/domain/*.test.ts` cubriendo saneamiento XSS, IDs y normalización.
  - DoD: `npx vitest run` y `npm run build` pasan con 0 errores.
- [x] **TASK-7.2: Capa de Servicios y Aislamiento de Efectos**
  - Implementar `driveTokenStore.ts`, `driveHttp.ts` (con manejo 401 centralizado).
  - Refactorizar `GoogleDriveAdapter.ts`, `LocalStorageAdapter.ts`, `index.ts`.
  - Migrar `download.ts`, `navigation.ts`, `image.ts`, `theme.ts`, `pdfFonts.ts`, `pdfRenderer.ts`.
  - Eliminar directorio `src/utils/` garantizando retrocompatibilidad en imports.
  - DoD: `npm run build` exitoso con adaptadores y servicios desacoplados.
- [x] **TASK-7.3: Primitivas Reutilizables y Hooks Compartidos**
  - Crear `src/components/common/cn.ts` (`clsx` + `tailwind-merge`).
  - Crear `src/components/common/hooks/useClickOutside.ts`.
  - Crear `EditorField.tsx`, `ItemCard.tsx`, `AddItemButton.tsx`.
  - Limpiar `Button.tsx` (remover prop muerta `asChild`).
  - DoD: Componentes comunes documentados con etiquetas y verificados en build.
- [x] **TASK-7.4: Refactor del Editor y Formularios**
  - Refactorizar secciones (`ProfileEditor`, `ExperienceEditor`, `EducationEditor`, `SkillsEditor`, `LanguagesEditor`).
  - Sanear URLs en `onBlur` en perfil.
  - Extraer `useExportWorkflow.ts` desde `ExportModal.tsx`.
  - Modularizar `FloatingStyleDock.tsx` y `EditorToolbar.tsx`.
  - DoD: Ningún componente de editor > 200 líneas; formularios funcionales y sin pérdida de estado.
- [x] **TASK-7.5: Refactor de Plantillas y Visor de Previsualización**
  - Extraer hojas de estilo de templates PDF a `src/components/pdf/templates/styles/`.
  - Unificar etiquetas ("Intermedio", "—") en los 6 templates.
  - Blindar enlaces de `MinimalTemplate.tsx` con `rel="noopener noreferrer"`.
  - Modularizar `ResumeViewer.tsx` en hooks (`useA4Zoom`, `useLivePdfPreview`) y submódulos.
  - DoD: Aspecto visual idéntico y sin errores de compilación PDF o HTML.
- [x] **TASK-7.6: Refactor del Lobby y Blindaje de Importación JSON**
  - Extraer `useDocumentLibrary.ts` y `useDriveConnection.ts`.
  - Conectar `ImportModal.tsx` con `normalizeCVData` y validar límite de 5MB.
  - Limpiar campos muertos en `types/storage.ts` y props en `QuickActionsBar.tsx`.
  - DoD: Tablero del lobby reactivo, importación validada contra payloads maliciosos.
- [x] **TASK-7.7: Barrido Documental y Plan de Investigación CV Wizard**
  - Auditar que el 100% de exportaciones posean su etiqueta correspondiente.
  - Documentar checklist de investigación de plantillas de CV Wizard para versión 2.2.
  - DoD: `npm test` y `npm run build` limpios.

---

## 4. Plan de Investigación: Catálogo de Plantillas CV Wizard (Para v2.2)

### 4.1 Objetivo
Catalogar variantes estilísticas y tipológicas de [CV Wizard](https://www.cvwizard.com/es/plantillas-cv) para expandir la oferta de CV Fácil de 3 a 8 plantillas manteniendo compatibilidad A4 y filtros ATS.

### 4.2 Criterios de Evaluación y Extracción
1. **Distribución Espacial:**
   - 1 columna limpia (ideal para perfiles técnicos y juniors con ATS estricto).
   - 2 columnas asimétricas 30/70 (columna izquierda para foto, contacto y habilidades; derecha para trayectoria).
   - 2 columnas simétricas con cabecera destacada (perfiles ejecutivos).
2. **Jerarquía Visual y Tipografía:**
   - Variantes con separadores sutiles, bloques con fondo contrastado o líneas de tiempo cronológicas.
   - Correspondencia con fuentes abiertas de Google Fonts (`Inter`, `Merriweather`, `IBM Plex`, `Roboto`).
3. **Factibilidad React-PDF:**
   - Evaluación previa de compatibilidad con el motor de layout de `@react-pdf/renderer` (evitar flexbox anidado complejo o pseudo-elementos no soportados).

### 4.3 Checklist de Implementación Futura (v2.2)
- [ ] Mapear 5 nuevas plantillas de referencia (ej. *Stanford*, *Otago*, *Harvard*, *Auckland*, *Wellington*).
- [ ] Crear fábricas de estilos desacopladas en `src/components/pdf/templates/styles/`.
- [ ] Implementar pares correspondientes en HTML (`src/components/preview/templates/`) y PDF (`src/components/pdf/templates/`).
- [ ] Registrar identificadores en `src/domain/catalogs.ts` (`TEMPLATES`) y tipos en `src/types/cv.ts`.
- [ ] Añadir pruebas de renderizado unitarias en `tests/domain/`.
