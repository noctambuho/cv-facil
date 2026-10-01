# Spec-Driven Development (SDD) Mandatory Protocol

Esta regla rige el ciclo de vida de desarrollo de software en este proyecto y workspace. Todo agente de IA o desarrollador debe adherirse estrictamente a las fases del pipeline SDD antes de escribir o modificar código de producción.

## 1. El Pipeline de 5 Fases

1. **Fase 1: Especificación Funcional (`specs/01-specification.md`)**
   - Definir Visión, Propósito y Diferenciadores.
   - Formular Historias de Usuario con Criterios de Aceptación en formato estándar:
     - *Dado* [Precondición o estado inicial del sistema]
     - *Cuando* [Acción o Evento disparador]
     - *Entonces* [Resultado observable y verificable]
   - Documentar Modelo Conceptual de Dominio (JSON Schema o tipos agnósticos).
   - **GATE 1 (Approval Gate 1):** STOP. Solicitar aprobación explícita del usuario antes de continuar.

2. **Fase 2: Arquitectura y Diseño Técnico (`specs/02-architecture-design.md`)**
   - Matriz de Justificación Técnica del Stack.
   - Diagrama de Flujo de Datos Unidireccional.
   - Definición inmutable de Tipos Estrictos (ej. `src/types/*.ts`).
   - Estructura de Directorios y Separación de Responsabilidades.
   - **GATE 2 (Approval Gate 2):** STOP. Solicitar aprobación del diseño técnico.

3. **Fase 2B: Sistema de Diseño e Integración Visual (`DESIGN.md`)**
   - Para aplicaciones web/UI, generar y validar `DESIGN.md` bajo el estándar Google Stitch.
   - Tokens ejecutables en YAML: colores, tipografía, radios y espaciados.
   - Validación de accesibilidad de contraste (WCAG AA).

4. **Fase 3: Desglose de Tareas Atómicas (`specs/03-tasks.md`)**
   - Desglosar la implementación en tareas atómicas, independientes y trazables a las historias de Fase 1.
   - Cada tarea debe contar con una Definition of Done (DoD) verificable.
   - Organizar en Hitos cronológicos (Milestones).
   - **GATE 3 (Approval Gate 3):** STOP. Solicitar aprobación del plan de tareas antes de emitir código.

5. **Fase 4: Implementación Disciplinada**
   - Ejecutar tarea por tarea en estricto orden de dependencias.
   - Tolerancia cero al Scope Creep: cualquier cambio no especificado requiere retroceder a Fase 1.
   - Código limpio, desacoplado y respetando al 100% los tipos de datos de Fase 2.

6. **Fase 5: Validación, Matriz de Trazabilidad (RTM) y Cierre**
   - Verificar empíricamente cada criterio Given-When-Then de la Fase 1 contra el sistema en ejecución.
   - Documentar la superación del 100% de criterios antes de dar por cerrado el requerimiento.

## 2. Invariantes Inviolables
- NUNCA escribir componentes o lógica sin antes haber fijado los contratos de tipos en `types/`.
- NUNCA saltear una compuerta de aprobación (Gate).
- Si surge ambigüedad, pausar y consultar; no asumir ni inventar requisitos.
- Cumplir estrictamente la Política de Commits establecida en [commit-policy.md](commit-policy.md), garantizando la trazabilidad hacia las tareas y fases SDD.
