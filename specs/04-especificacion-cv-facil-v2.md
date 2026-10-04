# Especificación Funcional: Plataforma "CV Fácil" v2.0

> **Documento SDD - Fase 1: Specification (Especificación Funcional)**  
> **Estado:** 🟡 En Revisión (Gate 1)  
> **Versión:** 2.0.0  
> **Fecha:** 2026-10-02  
> **Línea Base Previa:** [01-specification.md](01-specification.md) (v1.0.0 Aprobada)  
> **Autor/Equipo:** CV Fácil Core Team & Jotace

---

## 1. Visión y Propósito del Producto

**CV Fácil** evoluciona de un editor aislado a una plataforma web completa orientada a la creación, gestión y exportación de currículums profesionales, fundamentada en dos pilares inviolables:
1. **Transparencia y Sostenibilidad Comunitaria:** Software 100% gratuito y de código abierto (Open Source), sin modelos freemium ni marcas de agua, financiado exclusivamente mediante aportes voluntarios (Buy Me a Coffee, PayPal, Prex, Mercado Pago).
2. **Soberanía Absoluta de Datos (Local-First + BYOS - Bring Your Own Storage):** Nuestro servidor no almacena información personal ni base de datos de usuarios. Los currículums residen en el navegador del usuario (Modo Invitado) o sincronizados en su propia cuenta de Google Drive en una carpeta visible (`CV Fácil/`), asegurando que el usuario sea el dueño exclusivo de su información y pueda distribuirla libremente desde su teléfono móvil o computadora.

---

## 2. Historias de Usuario y Criterios de Aceptación (Given-When-Then)

Esta versión extiende las historias de la línea base (`US-01` a `US-05`) con los siguientes requerimientos de la plataforma:

---

### US-06: Landing Page de "CV Fácil" y Llamados a la Acción (CTA)

> [!NOTE]
> **Revisión SDD (Delta Spec v2.2.0):**  
> Los criterios 6.1, 6.2 y 6.3 han sido reemplazados y superados para la Landing Page (`/`) por las historias US-11 a US-18 especificadas en [08-rediseno-landing.md](08-rediseno-landing.md). Lobby y Editor conservan `UnifiedFooter.astro`.

**Como** visitante en búsqueda de empleo o de una herramienta de redacción de CV,  
**quiero** acceder a una página de bienvenida luminosa, moderna y transparente,  
**para** comprender la propuesta de valor, acceder al código fuente, apoyar el proyecto con donaciones y comenzar de inmediato.


* **Criterio 6.1 (Navegación y Acceso Directo Constante):**  
  * *Dado* un visitante en la Landing Page,  
  * *Cuando* visualiza la barra de navegación superior, la sección principal (*hero*) o el pie de página,  
  * *Entonces* siempre tiene visible un botón de llamada a la acción (CTA) "Comenzar" que lo conduce a la plataforma sin obstáculos.
* **Criterio 6.2 (Enlaces de Donación y Transparencia):**  
  * *Dado* el recorrido de la Landing,  
  * *Cuando* el usuario revisa la sección explicativa de la propuesta de valor y el pie de página,  
  * *Entonces* se presentan enlaces claros y directos a donaciones (Buy Me a Coffee, PayPal, Prex, Mercado Pago) y al repositorio de GitHub.
* **Criterio 6.3 (Pie de Página Unificado en Todo el Sitio):**  
  * *Dado* cualquiera de los tres módulos del sistema (Landing, Lobby o Editor),  
  * *Cuando* el usuario desciende al pie de página,  
  * *Entonces* se visualiza el mismo componente unificado de agradecimiento, donaciones y enlaces comunitarios.

---

### US-07: Lobby de Gestión de CVs (Inspirado en ONLYOFFICE)
**Como** usuario que postula a diferentes ofertas laborales,  
**quiero** un espacio centralizado para gestionar mis versiones de currículum y crear nuevos documentos,  
**para** mantener organizados mis CVs según el tipo de empresa o rol profesional.

* **Criterio 7.1 (Acciones Rápidas Superiores):**  
  * *Dado* un usuario en la vista del Lobby,  
  * *Cuando* consulta la sección superior de tarjetas de acción,  
  * *Entonces* dispone de accesos directos destacados: *"Crear CV en blanco"*, *"Elegir desde plantilla"* e *"Importar archivo existente (JSON/PDF)"*.
* **Criterio 7.2 (Gestión Completa de Documentos Recientes):**  
  * *Dado* el listado de documentos en el Lobby,  
  * *Cuando* el usuario interactúa con la fila de un CV,  
  * *Entonces* puede ejecutar de forma atómica: *Abrir en editor*, *Renombrar*, *Duplicar*, *Descargar PDF directo* y *Eliminar* (con diálogo de confirmación).
* **Criterio 7.3 (Redirección Inteligente de Sesión):**  
  * *Dado* un usuario que ya cuenta con una sesión iniciada activa,  
  * *Cuando* navega a la URL raíz del sitio,  
  * *Entonces* el sistema lo conduce directamente al Lobby sin forzarlo a pasar por la Landing pública.

---

### US-08: Soberanía de Almacenamiento y Seguridad de Datos
**Como** usuario celoso de la privacidad de mis datos personales y laborales,  
**quiero** elegir libremente entre usar la app sin registro o sincronizar mis CVs en mi propio Google Drive,  
**para** tener control total de mi información sin que un servidor intermedio almacene mis datos.

* **Criterio 8.1 (Modo Invitado / Local-First):**  
  * *Dado* un usuario que no desea iniciar sesión con Google,  
  * *Cuando* accede a crear o editar un CV,  
  * *Entonces* puede utilizar el 100% de las herramientas con persistencia exclusiva en el `localStorage` de su navegador.
* **Criterio 8.2 (Sincronización Transparente con Google Drive):**  
  * *Dado* un usuario que se autentica mediante Google OAuth,  
  * *Cuando* guarda, edita, renombra o elimina un CV,  
  * *Entonces* los cambios se reflejan en su cuenta de Google Drive dentro de una carpeta visible llamada `CV Fácil/` bajo el alcance de mínimo privilegio (`drive.file`).
* **Criterio 8.3 (Seguridad en Tránsito e Inmunidad a Inyecciones):**  
  * *Dado* el paso de parámetros entre vistas (ej. `/editor?id=...`),  
  * *Cuando* se lee o escribe en la URL,  
  * *Entonces* solo se transmiten identificadores opacos (UUIDv4 o ID sanitizado de Drive), validando estrictamente contra expresiones regulares y prohibiendo cualquier dato personal (PII) o caracteres de inyección de código/scripts en las URLs.

---

### US-09: Diálogo Inteligente de Exportación y Optimización de Peso
**Como** postulante que envía su currículum a portales web y sistemas ATS con límites estrictos de subida,  
**quiero** controlar el tamaño y la calidad del PDF antes de descargarlo o sincronizarlo,  
**para** garantizar que mi archivo sea admitido en portales que restringen el peso a 2MB o 5MB.

* **Criterio 9.1 (Apertura del Diálogo de Exportación):**  
  * *Dado* un usuario en el Editor,  
  * *Cuando* hace clic en el botón principal "Descargar / Exportar",  
  * *Entonces* se abre un modal interactivo con cálculo de peso estimado y perfiles de salida antes de emitir el documento.
* **Criterio 9.2 (Selector de Calidad / Compresión):**  
  * *Dado* el diálogo de exportación,  
  * *Cuando* el usuario selecciona un perfil (ej. *"Máxima Calidad Vectorial"* vs. *"Optimizado para Web (< 2MB)"*),  
  * *Entonces* el motor ajusta la compresión de activos gráficos (foto de perfil) para asegurar el cumplimiento del límite de peso.
* **Criterio 9.3 (Doble Destino: Local y Drive):**  
  * *Dado* el diálogo de exportación,  
  * *Cuando* el usuario pulsa "Descargar PDF", se inicia la descarga directa en su dispositivo;  
  * *Cuando* el usuario autenticado pulsa "Guardar en Google Drive", el archivo PDF se envía a la carpeta `CV Fácil/` de su Drive y queda registrado en el Lobby.

---

### US-10: Soporte Nativo de Tema Claro y Oscuro
**Como** usuario que trabaja en diferentes entornos de iluminación,  
**quiero** alternar entre modo claro y modo oscuro en toda la plataforma,  
**para** disfrutar de una experiencia visual cómoda y accesible.

* **Criterio 10.1 (Alternancia Global y Persistente):**  
  * *Dado* cualquier módulo (Landing, Lobby o Editor),  
  * *Cuando* el usuario pulsa el selector de tema en la barra de navegación,  
  * *Entonces* la paleta visual conmuta instantáneamente respetando los tokens de contraste WCAG AA, y la preferencia se almacena en el navegador para futuras visitas.
* **Criterio 10.2 (Estilo de la Landing Page):**  
  * *Dado* el tema claro por defecto de la Landing Page,  
  * *Cuando* el visitante navega por sus secciones,  
  * *Entonces* se presenta una estética luminosa, atractiva, con efectos sutiles de desenfoque y microinteracciones de alta legibilidad.

---

## 3. Delimitación de Fronteras (Scope)

### En Alcance (In Scope)
- 3 módulos enrutados de Astro: Landing Page (`/`), Lobby (`/lobby`), Editor (`/editor`).
- Componentes comunes reutilizables: Footer unificado con donaciones, Navbar con branding y switch de tema, ActionCards, Modales accesibles.
- Autenticación Google OAuth en cliente con alcance `drive.file` y carpeta visible `CV Fácil/`.
- Modo Invitado 100% funcional sin autenticación.
- Diálogo de exportación con control de compresión y destinos duales (Local y Drive).
- Tema claro y oscuro nativo persistente.

### Fuera de Alcance (Out of Scope)
- Servidores de base de datos propios (PostgreSQL, MongoDB, etc.).
- Procesamiento de pagos en servidor (los botones de donación son enlaces directos a las plataformas del creador).
- Almacenamiento en otros proveedores en la nube (Dropbox, OneDrive) para esta versión.

---

## 4. Compuerta de Aprobación (GATE 1)

> **GATE 1 STATUS:** 🟡 Pendiente de Aprobación del Usuario  
> Una vez validado este documento funcional, se autoriza el paso a la Fase 2: Arquitectura y Diseño Técnico (`specs/05-arquitectura-cv-facil-v2.md`).
