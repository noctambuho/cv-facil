# Especificación Funcional: Generador de CV Open-Source (Estilo CV Wizard)

> **Documento SDD - Fase 1: Specification (Especificación)**  
> **Estado:** 🟢 Aprobado por el Usuario  
> **Versión:** 1.0.0  
> **Fecha:** 2026-09-30  

---

## 1. Visión y Propósito del Producto

Desarrollar una aplicación web inspirada en **CV Wizard**, orientada a usuarios que necesitan redactar, formatear y previsualizar su Currículum Vitae de forma interactiva y profesional.

### Diferenciadores Clave:
1. **100% Gratuito y Open Source**: Sin modelos freemium, ni muros de pago para descargar.
2. **Cero Marcas de Agua**: El documento exportado pertenece íntegramente al usuario.
3. **Privacidad Primero (Local-First)**: Los datos no se almacenan en servidores externos por defecto; residen en el navegador del usuario.
4. **Renderizado en Tiempo Real**: Edición sincronizada instantánea en vista dividida (Formulario ↔ Previsualización A4).

---

## 2. Historias de Usuario y Criterios de Aceptación

Para asegurar que los requisitos sean verificables y no ambiguos, definimos los criterios mediante el formato estándar **Given-When-Then** (Dado-Cuando-Entonces).

### US-01: Formulario Modular de Contenido del CV
**Como** usuario que busca empleo,  
**quiero** completar secciones estructuradas de mi currículum (datos personales, experiencia, educación, habilidades, idiomas, etc.),  
**para** tener mi información organizada profesionalmente.

* **Criterio 1.1 (Datos Básicos):**  
  * *Dado* que el usuario abre el editor,  
  * *Cuando* ingresa nombre completo, cargo/titular, email, teléfono, ubicación, enlace web y resumen profesional,  
  * *Entonces* dichos campos se reflejan en el encabezado de la plantilla seleccionada.
* **Criterio 1.2 (Secciones Dinámicas / Listas):**  
  * *Dado* el módulo de Experiencia o Educación,  
  * *Cuando* el usuario pulsa "Añadir experiencia",  
  * *Entonces* se genera un nuevo bloque de formulario con campos de empresa, puesto, fechas, descripción y opción de eliminar o reordenar.
* **Criterio 1.3 (Habilidades e Idiomas):**  
  * *Dado* el módulo de habilidades,  
  * *Cuando* el usuario escribe una habilidad y su nivel de dominio,  
  * *Entonces* se agrega a la lista de tags/badges en la previsualización.

---

### US-02: Previsualización Reactiva en Tiempo Real
**Como** usuario,  
**quiero** ver en tiempo real cómo luce mi CV mientras escribo en el formulario,  
**para** ajustar textos, distribución y espaciado de inmediato.

* **Criterio 2.1 (Latencia Cero):**  
  * *Dado* que el usuario modifica un carácter en cualquier campo del formulario,  
  * *Cuando* se produce el evento de entrada,  
  * *Entonces* la vista previa en formato hoja A4 se actualiza instantáneamente sin necesidad de recargar la página.
* **Criterio 2.2 (Adaptabilidad de Pantalla):**  
  * *Dado* un dispositivo de escritorio/laptop,  
  * *Cuando* se accede a la app,  
  * *Entonces* se presenta un layout dividido (split-pane: 50% editor, 50% preview interactivo o con zoom ajustable).

---

### US-03: Catálogo de Plantillas Intercambiables
**Como** usuario,  
**quiero** cambiar la plantilla estética de mi CV con un solo clic,  
**para** evaluar cuál diseño proyecta mejor mi perfil sin tener que volver a cargar los datos.

* **Criterio 3.1 (Separación Contenido vs Presentación):**  
  * *Dado* un CV con datos ya cargados,  
  * *Cuando* el usuario selecciona una plantilla diferente (ej. *Moderna*, *Clásica*, *Minimalista/Tech*),  
  * *Entonces* el diseño cambia inmediatamente preservando exactamente los mismos datos.
* **Criterio 3.2 (Personalización de Acento de Color y Tipografía):**  
  * *Dado* el selector de tema de la plantilla,  
  * *Cuando* el usuario escoge un color primario o tipografía,  
  * *Entonces* los títulos, iconos y barras divisorias de la plantilla adoptan el nuevo estilo.

---

### US-04: Exportación a PDF de Alta Calidad y Sin Marcas de Agua
**Como** usuario,  
**quiero** descargar mi currículum en formato PDF listo para enviar a ofertas de trabajo,  
**para** postularme con un archivo estándar, nítido y libre de marcas o restricciones comerciales.

* **Criterio 4.1 (Fidelidad de Impresión A4):**  
  * *Dado* el documento previsualizado,  
  * *Cuando* el usuario hace clic en "Descargar PDF",  
  * *Entonces* se genera un archivo PDF con proporciones estándar A4 (210 x 297 mm), respetando tipografías, colores, saltos de página y márgenes.
* **Criterio 4.2 (Sin Marcas de Agua):**  
  * *Dado* el PDF generado,  
  * *Cuando* se inspecciona el archivo,  
  * *Entonces* no debe contener logos de la plataforma, avisos de versión gratuita ni textos promocionales.

---

### US-05: Persistencia Local y Portabilidad de Datos
**Como** usuario,  
**quiero** que mis datos no se pierdan si cierro la pestaña o recargo la página,  
**para** poder retomar mi redacción en cualquier momento sin necesidad de crear una cuenta con contraseña.

* **Criterio 5.1 (Auto-guardado):**  
  * *Dado* que el usuario escribe en el formulario,  
  * *Cuando* transcurren 500ms tras la última edición,  
  * *Entonces* el estado completo del CV se persiste en el `localStorage` del navegador.
* **Criterio 5.2 (Exportación e Importación JSON):**  
  * *Dado* que el usuario desea respaldar o mover sus datos a otro equipo,  
  * *Cuando* hace clic en "Exportar JSON" / "Importar JSON",  
  * *Entonces* puede descargar un archivo `.json` estructurado o cargar uno previo para restaurar el contenido íntegro.

---

## 3. Modelo de Dominio de Datos (Schema Conceptual)

El estado del CV debe ser completamente serializable y desacoplado del estilo visual:

```json
{
  "profile": {
    "fullName": "string",
    "headline": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "linkedin": "string",
    "github": "string",
    "summary": "string",
    "avatarUrl": "string"
  },
  "experiences": [
    {
      "id": "uuid",
      "company": "string",
      "role": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "current": "boolean",
      "description": "string"
    }
  ],
  "education": [
    {
      "id": "uuid",
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string"
    }
  ],
  "skills": [
    {
      "id": "uuid",
      "name": "string",
      "level": "enum ['basic', 'intermediate', 'advanced']"
    }
  ],
  "languages": [
    {
      "id": "uuid",
      "language": "string",
      "proficiency": "string"
    }
  ],
  "customSections": [
    {
      "id": "uuid",
      "title": "string",
      "content": "string"
    }
  ],
  "settings": {
    "templateId": "modern | classic | minimal",
    "accentColor": "string (hex)",
    "fontFamily": "sans | serif | mono",
    "fontSize": "sm | md | lg",
    "paperSize": "A4"
  }
}
```

---

## 4. Alcance (In Scope vs Out of Scope)

### Dentro del Alcance (MVP):
- Interfaz en split-screen (Editor colapsable/expandible + Canvas A4 con zoom).
- Carga de datos de ejemplo ("Rellenar con datos de muestra") para facilitar pruebas.
- Al menos 3 plantillas diferenciadas (Moderna con barra lateral, Clásica corporativa, Minimalista de una sola columna).
- Exportación directa a PDF nítido en el cliente.
- Guardado en `localStorage` y respaldo JSON.

### Fuera del Alcance (Post-MVP):
- Cuentas de usuario con base de datos en la nube (PostgreSQL, Supabase, etc.).
- Pasarelas de pago o funciones bloqueadas.
- Integración directa con LinkedIn API (por restricciones de scraping/autenticación).
- Corrector ortográfico asistido por API externa (se mantendrá 100% offline/local-first en primera fase).

---

## 5. Criterios de Aprobación de la Fase 1 (Gate 1)

Antes de proceder al diseño técnico (Fase 2):
1. ¿Los requisitos cubren la expectativa de recrear la experiencia fluida de CV Wizard?
2. ¿El modelo de datos y las 3 plantillas propuestas son adecuados para arrancar?
3. ¿El enfoque 100% cliente / local-first satisface el requisito de "gratis, open source y sin marcas de agua"?
