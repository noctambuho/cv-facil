# Arquitectura Técnica y Abstracción de Componentes: "CV Fácil" v2.0

> **Documento SDD - Fase 2: Architecture & Technical Design**  
> **Estado:** 🟡 En Revisión (Gate 2)  
> **Versión:** 2.0.0  
> **Fecha:** 2026-10-02  
> **Especificación Funcional Vinculada:** [04-especificacion-cv-facil-v2.md](04-especificacion-cv-facil-v2.md) (v2.0.0)  
> **Autor/Equipo:** CV Fácil Core Architecture Team & Jotace

---

## 1. Principios Arquitectónicos Rectores

1. **Arquitectura de Islas Astro (Astro Islands):**  
   Aprovechar el modelo de renderizado de Astro al máximo: las páginas y secciones estáticas (Landing Page, Layouts, Footer) se compilan a HTML puro con **cero JavaScript inicial**; las secciones dinámicas (Lobby, Editor, modales) se aíslan en **islas interactivas de React** con hidratación selectiva (`client:load`, `client:idle`).

2. **Separación Estricta de Responsabilidades (SoC):**  
   - **Capa de Presentación:** Componentes visuales desacoplados que solo reciben props y disparan eventos.
   - **Capa de Dominio/Estado:** Modelos de datos inmutables y stores reactivos (`nanostores`).
   - **Capa de Infraestructura/Almacenamiento:** Adaptadores de persistencia que implementan una interfaz común sin que la UI conozca los detalles de Google Drive o `localStorage`.

3. **Abstracción y Reutilización de Patrones:**  
   Identificar componentes repetitivos entre Landing, Lobby y Editor para extraer primitivas agnósticas y evitar código duplicado.

4. **Seguridad y Resistencia a Inyecciones:**  
   - **Zero-PII en URLs:** Jamás exponer nombres, correos o datos del CV en query strings.
   - **Validación de Identificadores:** Sanitización estricta de parámetros (`?id=...`) mediante regex antes de consultar cualquier almacenamiento.
   - **Principio de Mínimo Privilegio:** Alcance `drive.file` restringido exclusivamente a los archivos creados por la aplicación.

---

## 2. Mapa de Rutas e Islas en Astro

```
src/pages/
├── index.astro       --> Landing Page (Renderizado Estático / SSG, hidratación mínima)
├── lobby.astro       --> Lobby de Documentos (Astro Shell + Isla React <LobbyApp />)
└── editor.astro      --> Editor Reactivo (Astro Shell + Isla React <EditorApp />)
```

### Tabla de Hidratación por Módulo

| Ruta | Componente Astro Base | Islas React (`client:*`) | Justificación de Rendimiento |
|---|---|---|---|
| `/` | `index.astro` | `ThemeToggle` (`client:idle`), `HeroCTA` (`client:load`) | 95% HTML estático. Carga instantánea con puntuación 100 en Google Lighthouse. |
| `/lobby` | `lobby.astro` | `LobbyDashboard` (`client:load`) | Tablero interactivo con conexión a Drive, tabla de recientes y modales. |
| `/editor` | `editor.astro` | `ResumeEditor` (`client:load`) | Editor dividido en tiempo real con sincronización reactiva hacia la vista A4. |

---

## 3. Catálogo de Patrones y Abstracción de Componentes

Identificamos los elementos comunes en las tres vistas para crear componentes reutilizables:

```
src/components/
├── common/                     --> Componentes Compartidos y Abstracciones
│   ├── layout/
│   │   ├── BaseLayout.astro    --> Shell común con <head>, fuentes, temas y meta
│   │   ├── Navbar.astro        --> Barra superior (Logo CV Fácil, ThemeToggle, AuthBadge)
│   │   └── UnifiedFooter.astro --> Footer con donaciones (Coffee, PayPal, Prex, MP) y GitHub
│   ├── primitives/
│   │   ├── Button.tsx          --> Botón accesible con variantes (primary, secondary, ghost, danger)
│   │   ├── ActionCard.tsx      --> Tarjeta genérica con icono, título, badge y acción click/link
│   │   ├── Modal.tsx           --> Diálogo accesible con focus-trap, backdrop y tecla Escape
│   │   ├── Input.tsx           --> Campo de texto con validación y estilos accesibles
│   │   └── Dropdown.tsx        --> Menú desplegable flotante con cierre al clic exterior
│   └── feedback/
│       ├── Toast.tsx           --> Notificaciones de guardado, error y sincronización
│       └── Skeleton.tsx        --> Estado de carga para documentos y tablas
├── landing/                    --> Componentes exclusivos de la Landing
│   ├── HeroSection.astro
│   ├── FeaturesGrid.astro
│   └── DonationBanner.astro
├── lobby/                      --> Componentes exclusivos del Lobby (ONLYOFFICE-style)
│   ├── QuickActionsBar.tsx     --> Fila superior con ActionCards ("En blanco", "Plantilla", "Importar")
│   ├── RecentDocumentsTable.tsx--> Tabla de archivos con menú de fila (Renombrar, Duplicar, Borrar)
│   └── ImportModal.tsx
└── editor/                     --> Componentes del Editor (Evolución de v1)
    ├── SplitPane.tsx           --> Contenedor 50/50 formulario y preview
    ├── FloatingStyleDock.tsx   --> Menú desplegable inferior derecho para plantilla, colores y fuente
    ├── ExportModal.tsx         --> Diálogo US-09: calidad de impresión (< 2MB) y destino (Drive/Local)
    └── preview/                --> Plantillas A4 y visor de hoja
```

---

## 4. Capa de Abstracción de Almacenamiento (Storage Adapter Pattern)

Para permitir que el usuario opere en **Modo Invitado** o en **Google Drive** sin cambiar la lógica del Editor o del Lobby, se define el contrato formal `IStorageAdapter`:

```typescript
/**
 * src/services/storage/IStorageAdapter.ts
 * Contrato inmutable para la gestión de documentos y persistencia en CV Fácil.
 */

export interface CVMetadata {
  id: string;                     // Identificador único sanitizado (UUIDv4 o Drive File ID)
  title: string;                  // Nombre del archivo (ej. "CV_Desarrollador_2026")
  updatedAt: string;              // Fecha ISO-8601 de última modificación
  sizeBytes?: number;             // Tamaño aproximado
  isDriveSynced: boolean;         // true si reside en Google Drive, false si es localStorage
  hasExportedPDF: boolean;        // true si existe una exportación en PDF vinculada
}

export interface IStorageAdapter {
  /**
   * Obtiene la lista de documentos disponibles para el usuario actual.
   */
  listDocuments(): Promise<CVMetadata[]>;

  /**
   * Carga el contenido JSON estructurado de un CV específico.
   * @param id Identificador sanitizado del documento
   */
  getDocument(id: string): Promise<CVData>;

  /**
   * Guarda o actualiza los datos estructurados de un CV.
   * @param doc Datos completos del CV
   * @param customName Nombre opcional para el archivo
   */
  saveDocument(doc: CVData, customName?: string): Promise<CVMetadata>;

  /**
   * Renombra un documento existente.
   */
  renameDocument(id: string, newTitle: string): Promise<void>;

  /**
   * Duplica un documento existente generando un nuevo identificador.
   */
  duplicateDocument(id: string): Promise<CVMetadata>;

  /**
   * Elimina permanentemente el documento.
   */
  deleteDocument(id: string): Promise<void>;

  /**
   * Guarda el archivo binario PDF en el destino correspondiente.
   * @param id Identificador del documento vinculado
   * @param pdfBlob Archivo binario generado
   * @param filename Nombre del archivo .pdf
   */
  savePDF(id: string, pdfBlob: Blob, filename: string): Promise<string>;
}
```

### Implementaciones Concretas:
1. **`LocalStorageAdapter` (Modo Invitado):**  
   Gestiona los documentos bajo la clave `cv_facil_library` en `localStorage`, garantizando persistencia en el dispositivo sin llamadas de red.
2. **`GoogleDriveAdapter` (Modo Autenticado):**  
   Utiliza la API REST de Google Drive con el alcance `https://www.googleapis.com/auth/drive.file`. Crea automáticamente la carpeta visible `CV Fácil/` en el Drive del usuario y maneja la sincronización del par `[id].json` y `[id].pdf`.

---

## 5. Seguridad, Cifrado y Protección de URLs

En cumplimiento con el requisito de seguridad e integridad:
1. **Tráfico Seguro y Cifrado:** Toda comunicación con la API de Google Drive se realiza obligatoriamente bajo **TLS 1.3 / HTTPS**.
2. **Sanitización Estricta de Parámetros de URL:**  
   Al recibir `/editor?id=[valor]`, el parámetro se somete a validación antes de procesarlo:
   ```typescript
   // Expresión regular que admite exclusivamente UUIDs v4 o IDs seguros de Google Drive
   const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]{10,64}$/;

   export function sanitizeDocumentId(rawId: string | null): string | null {
     if (!rawId || !SAFE_ID_REGEX.test(rawId)) {
       console.warn('ID de documento inválido o potencialmente malicioso bloqueado.');
       return null;
     }
     return encodeURIComponent(rawId);
   }
   ```
3. **Inmunidad a XSS y Exposición de PII:**  
   Bajo ninguna circunstancia se colocan datos personales (nombres, teléfonos, historial laboral) en la URL o en cookies no seguras. El estado temporal se mantiene en memoria del navegador o en el adaptador de almacenamiento correspondiente.

---

## 6. Arquitectura SEO y Metadatos para el Mercado Hispanohablante

Para posicionar a **CV Fácil** en los primeros lugares de búsqueda orgánica en países de habla hispana (España, México, Argentina, Colombia, Chile, etc.) cuando los usuarios busquen herramientas de currículum vitae:

1. **Estrategia de Palabras Clave Objetivo (Long-tail & Intent):**
   - *"crear curriculum vitae gratis"*, *"hacer cv online pdf"*, *"plantillas de curriculum sin marca de agua"*, *"generador de cv gratis local"*, *"curriculum vitae profesional argentina / mexico / espana"*.
2. **Componente de Metadatos en Astro (`SEO.astro` / `BaseLayout.astro`):**
   - **Etiquetas Meta Primarias:** `title` dinámico con intención de búsqueda, `description` (150-160 caracteres optimizados para CTR), `canonical` URL absoluta, `robots: index, follow`.
   - **Internacionalización y Geo-targeting:**
     - `<link rel="alternate" hreflang="es" href="https://cvfacil.app/" />`
     - `<link rel="alternate" hreflang="x-default" href="https://cvfacil.app/" />`
     - Metadatos Open Graph regionales: `og:locale:es_ES`, `og:locale:alternate` (`es_MX`, `es_AR`, `es_CO`, etc.).
   - **Protocolos Sociales (Rich Snippets):**
     - Open Graph (`og:type`, `og:title`, `og:description`, `og:image:width:1200`, `og:image:height:630`).
     - Twitter Card (`summary_large_image`).
3. **Datos Estructurados Schema.org (JSON-LD):**
   - Esquemas `WebApplication` y `SoftwareApplication`:
     ```json
     {
       "@context": "https://schema.org",
       "@type": "WebApplication",
       "name": "CV Fácil",
       "applicationCategory": "BusinessApplication",
       "operatingSystem": "All",
       "offers": {
         "@type": "Offer",
         "price": "0",
         "priceCurrency": "USD"
       },
       "description": "Crea, edita y descarga tu currículum vitae profesional en formato PDF A4 en tiempo real. 100% gratuito, sin marcas de agua y con privacidad total."
     }
     ```
4. **Sitemap y Robots:**
   - Integración de `@astrojs/sitemap` para generar automáticamente `sitemap-index.xml`.
   - `public/robots.txt` optimizado permitiendo el rastreo de `/` e instruyendo la no-indexación de estados efímeros del editor (`Disallow: /editor?*`).

---

## 7. Hardening de Seguridad del Stack (Astro + React + Google Drive API)

Análisis proactivo y mitigaciones para la combinación tecnológica:

1. **Mitigación de Cross-Site Scripting (XSS) y Secuestro de Enlaces:**
   - **Vulnerabilidad:** Inyección de esquemas `javascript:` o `data:` en los enlaces que el usuario ingresa para su sitio web, LinkedIn o GitHub.
   - **Parche:** Implementar utilidad `sanitizeExternalUrl()` que bloquee cualquier protocolo que no sea estrictamente `http:` o `https:`, forzando `rel="noopener noreferrer"`.
2. **Mitigación de SVG/Image Payload Ingestion (Foto de Perfil):**
   - **Vulnerabilidad:** Carga de archivos SVG maliciosos que contengan scripts incrustados ejecutables en el navegador.
   - **Parche:** Validar firmas de archivo en cliente (magic bytes), limitar subidas a `image/jpeg` y `image/png`, o rasterizar/comprimir la imagen a Canvas antes de almacenarla en base64.
3. **Manejo Seguro de Credenciales y Tokens OAuth:**
   - **Vulnerabilidad:** Fuga de tokens de Google en `localStorage` accesibles ante cualquier XSS.
   - **Parche:** Los tokens de acceso de Google Identity Services se mantienen **estrictamente en memoria de sesión volátil** y nunca se escriben en almacenamiento persistente no cifrado.
4. **Política de Seguridad de Contenido (Content Security Policy - CSP):**
   - Inyección de cabeceras/meta CSP restrictivas:
     - `default-src 'self';`
     - `script-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/client https://apis.google.com;`
     - `connect-src 'self' https://www.googleapis.com https://accounts.google.com;`
     - `img-src 'self' data: blob: https://*.googleusercontent.com;`
     - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;`
     - `font-src 'self' https://fonts.gstatic.com;`
     - `frame-src https://accounts.google.com;`
5. **Comentarios de Auditoría en Código:**
   - Toda función de seguridad debe documentarse con la convención:
     `// SECURITY (CWE-79 / CWE-94): [Justificación y prueba de mitigación]`.

---

## 8. Estándares de Documentación del Código (Comentarios)

Para cumplir con el requerimiento de mantenibilidad:
- Todo componente, función de adaptador o tipo debe contar con bloques **TSDoc / JSDoc** explicando:
  - Propósito del componente.
  - Descripción de cada prop o parámetro.
  - Efectos secundarios o precondiciones.
- Ejemplo estándar del proyecto:
  ```typescript
  /**
   * ActionCard: Componente interactivo para disparar acciones o navegación.
   * Reutilizado en la Landing (tarjetas de características) y en el Lobby (acciones rápidas).
   * 
   * @param title Título principal de la tarjeta
   * @param description Breve texto explicativo
   * @param icon Componente de icono Lucide
   * @param onClick Callback disparado al hacer clic
   */
  ```

---

## 9. Compuerta de Aprobación (GATE 2)

> **GATE 2 STATUS:** 🟡 Pendiente de Aprobación de Arquitectura  
> Una vez validado este diseño técnico, se autoriza el paso a la Fase 2B (Sistema de Diseño Visual) y Fase 3 (Desglose de Tareas Atómicas).
