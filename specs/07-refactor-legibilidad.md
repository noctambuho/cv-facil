# Especificación Técnica y Tareas: Refactor de Legibilidad y Arquitectura (v2.1.0)

> **Documento SDD - Fases 2 y 3: Architecture & Tasks**  
> **Estado:** 🟢 Aprobado por Usuario  
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
│   ├── editor/         # Sections, fields/ (EditorField, ItemCard), hooks/ (useExportWorkflow, useListCrud)
│   ├── preview/        # ResumeViewer (subcomponentes/hooks), templates HTML
│   ├── pdf/            # ResumePdfDocument, templates PDF, styles/
│   ├── lobby/          # Dashboard, modales, hooks/ (useDocumentLibrary, useDriveConnection)
│   └── landing/        # Secciones de Landing Page
tests/
└── domain/             # Tests unitarios con Vitest
```

---

## 3. Desglose de Tareas Atómicas (Milestones)

- [ ] **TASK-7.0: Gobernanza SDD y Regla de Legibilidad**
  - Crear `specs/07-refactor-legibilidad.md` y `.agents/rules/code-readability.md`.
  - DoD: Reglas y especificación sincronizadas en repositorio.
- [ ] **TASK-7.1: Capa de Dominio y Tests Unitarios (Vitest)**
  - Instalar `vitest`.
  - Crear `src/types/import.ts`, `src/domain/security.ts`, `src/domain/catalogs.ts`, `src/domain/cvFormatters.ts`, `src/domain/listOps.ts`, `src/domain/cvNormalizer.ts`, `src/domain/exportEstimate.ts`.
  - Crear tests unitarios en `tests/domain/*.test.ts` cubriendo saneamiento XSS, IDs y normalización.
  - DoD: `npx vitest run` y `npm run build` pasan con 0 errores.
- [ ] **TASK-7.2: Capa de Servicios y Aislamiento de Efectos**
  - Implementar `driveTokenStore.ts`, `driveHttp.ts` (con manejo 401 centralizado).
  - Refactorizar `GoogleDriveAdapter.ts`, `LocalStorageAdapter.ts`, `index.ts`.
  - Migrar `download.ts`, `navigation.ts`, `image.ts`, `theme.ts`, `pdfFonts.ts`, `pdfRenderer.ts`.
  - Eliminar directorio `src/utils/` garantizando retrocompatibilidad en imports.
  - DoD: `npm run build` exitoso con adaptadores y servicios desacoplados.
- [ ] **TASK-7.3: Primitivas Reutilizables y Hooks Compartidos**
  - Crear `src/components/common/cn.ts` (`clsx` + `tailwind-merge`).
  - Crear `src/components/common/hooks/useClickOutside.ts`.
  - Crear `EditorField.tsx`, `ItemCard.tsx`, `AddItemButton.tsx`.
  - Limpiar `Button.tsx` (remover prop muerta `asChild`).
  - DoD: Componentes comunes documentados con etiquetas y verificados en build.
- [ ] **TASK-7.4: Refactor del Editor y Formularios**
  - Refactorizar secciones (`ProfileEditor`, `ExperienceEditor`, `EducationEditor`, `SkillsEditor`, `LanguagesEditor`).
  - Sanear URLs en `onBlur` en perfil.
  - Extraer `useExportWorkflow.ts` desde `ExportModal.tsx`.
  - Modularizar `FloatingStyleDock.tsx` y `EditorToolbar.tsx`.
  - DoD: Ningún componente de editor > 200 líneas; formularios funcionales y sin pérdida de estado.
- [ ] **TASK-7.5: Refactor de Plantillas y Visor de Previsualización**
  - Extraer hojas de estilo de templates PDF a `src/components/pdf/templates/styles/`.
  - Unificar etiquetas ("Intermedio", "—") en los 6 templates.
  - Blindar enlaces de `MinimalTemplate.tsx` con `rel="noopener noreferrer"`.
  - Modularizar `ResumeViewer.tsx` en hooks (`useA4Zoom`, `useLivePdfPreview`) y submódulos.
  - DoD: Aspecto visual idéntico y sin errores de compilación PDF o HTML.
- [ ] **TASK-7.6: Refactor del Lobby y Blindaje de Importación JSON**
  - Extraer `useDocumentLibrary.ts` y `useDriveConnection.ts`.
  - Conectar `ImportModal.tsx` con `normalizeCVData` y validar límite de 5MB.
  - Limpiar campos muertos en `types/storage.ts` y props en `QuickActionsBar.tsx`.
  - DoD: Tablero del lobby reactivo, importación validada contra payloads maliciosos.
- [ ] **TASK-7.7: Barrido Documental y Plan de Investigación CV Wizard**
  - Auditar que el 100% de exportaciones posean su etiqueta correspondiente.
  - Documentar checklist de investigación de plantillas de CV Wizard para versión 2.2.
  - DoD: `npx astro check`, `npm run build`, `npx vitest run` limpios.
