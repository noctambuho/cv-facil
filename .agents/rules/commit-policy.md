# Política de Commits para Spec-Driven Development (SDD)

Esta política define el estándar obligatorio de versionado en Git para este proyecto. Su objetivo es garantizar la **trazabilidad bidireccional** entre el historial de commits y los artefactos vivos de SDD (`specs/`, `DESIGN.md`, `src/types/`).

---

## 1. Estructura del Mensaje de Commit

Cada mensaje de commit debe seguir la convención **Conventional Commits** enriquecida con metadatos de trazabilidad SDD:

```
<tipo>(<ámbito>): <descripción corta en imperativo y minúsculas> [ID-TAREA opcional]

[Cuerpo opcional: explicación del porqué, contexto de arquitectura o impacto]

[Pie opcional: Referencias a fases o compuertas SDD]
```

### Ejemplos Válidos:
- `feat(preview): implementar visor A4 con controles de zoom [TASK-2.1]`
- `arch(types): definir interfaces estrictas de experiencia y educación [TASK-1.2]`
- `spec(req): agregar criterio Given-When-Then para exportación json`
- `design(tokens): actualizar paleta de colores corporativa según standard stitch`
- `refactor(arch): reorganizar formularios bajo ui/editor y sincronizar specs`
- `fix(storage): corregir debounce en persistencia local [TASK-1.4]`

---

## 2. Taxonomía de Tipos en SDD

Los tipos de commit reflejan la fase del pipeline SDD donde se origina el cambio:

| Tipo | Fase SDD Asociada | Cuándo Usarlo |
| :--- | :--- | :--- |
| `spec` | **Fase 1** (Requisitos) | Creación o ajuste de historias de usuario, modelo conceptual o criterios Given-When-Then (`specs/01-specification.md`). |
| `arch` | **Fase 2** (Arquitectura) | Decisiones técnicas, diseño de directorios o contratos inmutables de tipos (`specs/02-architecture-design.md`, `src/types/`). |
| `design` | **Fase 2B** (Diseño UI) | Modificaciones al sistema de diseño, tokens CSS o directrices visuales (`DESIGN.md`, `src/styles/design-tokens.css`). |
| `task` | **Fase 3** (Desglose) | Creación, actualización del estado o adición de tareas atómicas (`specs/03-tasks.md`). |
| `feat` | **Fase 4** (Implementación) | Nueva funcionalidad de producción que resuelve una tarea especificada. **Debe incluir `[TASK-X.Y]`**. |
| `refactor` | **Fase 4** (Mantenimiento) | Reorganización interna de código o arquitectura sin alterar el comportamiento observable. |
| `fix` | **Fase 5 / Mantenimiento** | Corrección de un fallo o regresión respecto a los criterios de aceptación. |
| `test` | **Fase 5** (Validación) | Pruebas unitarias, de integración o scripts de verificación de la Matriz de Trazabilidad (RTM). |
| `chore` | Soporte general | Actualización de dependencias (`package.json`), tooling, configuración de build o linters. |
| `docs` | Documentación | Documentación no normativa (ej. `README.md`, guías externas). |

---

## 3. Ámbitos Frecuentes (*Scopes*)

El ámbito delimita el módulo o componente impactado:

- `editor`: Formularios y componentes de entrada de datos (`src/components/ui/editor/`).
- `preview`: Visor A4 y renderizado de currículum (`src/components/preview/`).
- `template`: Plantillas de diseño del CV (`ModernTemplate`, `ClassicTemplate`, etc.).
- `toolbar`: Barra de acciones globales (descargar PDF, limpiar, cargar ejemplo).
- `types`: Contratos y tipos estrictos de dominio (`src/types/`).
- `storage`: Persistencia local, exportación o importación de estado.
- `pdf`: Motor de impresión A4 y utilidades de exportación.
- `tokens`: Variables y tokens de diseño CSS.
- `sdd`: Artefactos del marco de trabajo SDD y reglas de gobernanza.

---

## 4. Reglas Inviolables (Invariantes de Commit)

1. **Trazabilidad Obligatoria (`TASK-ID`):** Todo commit de tipo `feat` debe incluir al final de la primera línea el identificador de la tarea asociada (ej. `[TASK-3.1]`).
2. **Cero Commits Rotos:** Ningún commit debe ingresar al repositorio si el proyecto no compila limpiamente (`npm run build` debe pasar con 0 errores).
3. **Atomicidad:** Cada commit debe representar una unidad lógica de trabajo indivisible. Evitar "mega-commits" que mezclen refactorizaciones con nuevas funcionalidades.
4. **Verbo en Imperativo Presente:** Usar la forma imperativa en infinitivo o presente ("agregar", "actualizar", "corregir", "mover"), nunca en pasado ("agregado", "se corrigió").
5. **Spec Sincronizada:** Si un commit modifica la estructura de archivos, contratos de tipos o comportamiento del sistema, la especificación en `specs/` debe estar actualizada en el mismo commit o en un commit previo de tipo `arch` o `spec`.
