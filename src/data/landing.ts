/**
 * src/data/landing.ts
 * [CONSTANTE] Textos y copy estructurados en español rioplatense (voseo) para la Landing Page.
 * Trazabilidad: TASK-8.1, US-11 a US-18, specs/08-rediseno-landing.md
 */

import type { HowItWorksStep, DemoFrame, FeatureCard, AboutItem } from '../types/landing';

/**
 * [CONSTANTE] Contenido editorial de la sección Hero.
 */
export const HERO_DATA = {
  titlePrefix: 'CV Fácil',
  titleHighlight: 'Creá tu currículum fácil, rápido, gratis.',
  ctaText: 'Ir al editor',
  heroBannerAlt:
    'Tres ejemplos de currículum profesional creados con CV Fácil en plantillas Moderna, Clásica y Minimalista',
};

/**
 * [CONSTANTE] Pasos y capturas explicativas de la sección "Cómo funciona".
 */
export const HOW_IT_WORKS_DATA: {
  tag: string;
  title: string;
  subtitle: string;
  steps: HowItWorksStep[];
  demoFrames: DemoFrame[];
} = {
  tag: 'Paso a paso',
  title: 'Tres pasos. Sin vueltas.',
  subtitle: 'De tus datos a un PDF profesional listo para postularte en menos de 10 minutos.',
  steps: [
    {
      id: 'fill',
      icon: 'ClipboardList',
      title: 'Llená el formulario con tus datos',
      description:
        'Completá tus datos en un formulario guiado: experiencia laboral, formación académica, competencias e idiomas con orden cronológico automático.',
    },
    {
      id: 'design',
      icon: 'Palette',
      title: 'Diseñá a tu gusto',
      description:
        'Elegí una plantilla prediseñada y hacela tuya: seleccioná el color que mejor se adapte a vos, la fuente que mejor transmita tu personalidad y la estructura que resalte lo que querés destacar.',
    },
    {
      id: 'download',
      icon: 'Download',
      title: 'Descargá tu CV',
      description:
        'Bajalo en PDF nítido en formato A4, guardalo en tu propio Google Drive o exportalo en formato JSON para reutilizarlo cuando quieras.',
      comingSoon: ['DOCX'],
    },
  ],
  demoFrames: [
    {
      stepId: 'fill',
      badge: 'Paso 1: Datos',
      alt: 'Paso 1: Formulario interactivo cargando experiencia y datos personales',
    },
    {
      stepId: 'design',
      badge: 'Paso 2: Estilo',
      alt: 'Paso 2: Menú flotante cambiando tipografía, colores y plantilla en tiempo real',
    },
    {
      stepId: 'download',
      badge: 'Paso 3: Exportación',
      alt: 'Paso 3: Modal de exportación descargando PDF vectorial sin marcas de agua',
    },
  ],
};

/**
 * [CONSTANTE] Bento Grid de características y ventajas competitivas.
 */
export const FEATURES_DATA: {
  tag: string;
  title: string;
  subtitle: string;
  cards: FeatureCard[];
} = {
  tag: 'Diferenciales',
  title: 'Hecho para que te llamen',
  subtitle: 'Optimizado para superar los filtros ATS y darte el control total de tus datos.',
  cards: [
    {
      id: 'ats',
      title: 'Que no te descarte un robot',
      description:
        'No pierdas más oportunidades de empleo por culpa de automatizaciones. Estructura de datos optimizada para la lectura de escaneo que realizan los filtros ATS. Devolvele al recruiter la posibilidad de conocerte.',
      layout: 'wide',
    },
    {
      id: 'drive',
      title: 'Tus CVs, siempre a mano',
      description:
        'Iniciá sesión con tu cuenta de Google, sincronizá tus CVs creados en tu Google Drive personal y tené acceso a ellos siempre desde cualquier dispositivo.',
      layout: 'narrow',
    },
    {
      id: 'privacy',
      title: 'Tus datos son tuyos',
      description:
        '¿Preferís solo usar el editor y descargar tu archivo? No hay problema. Tus datos son tuyos: nunca tocan ni viajan a ningún servidor intermedio.',
      layout: 'half',
    },
    {
      id: 'formats',
      title: 'El formato que necesites',
      description: 'Elegí el formato que quieras, o el que más conozcas para tu postulación laboral:',
      layout: 'half',
      formats: [
        { label: 'PDF', comingSoon: false },
        { label: 'JSON', comingSoon: false },
        { label: 'DOCX', comingSoon: true },
        { label: 'Markdown', comingSoon: true },
      ],
    },
    {
      id: 'free',
      title: 'Gratis. Para siempre.',
      description:
        'Y lo más importante: es 100% gratis. Sin suscripciones sorpresas, sin marcas de agua ni trucos freemium. Vos decidís apoyar su desarrollo voluntariamente con tus donaciones.',
      layout: 'full',
      withRotatingCta: true,
    },
  ],
};

/**
 * [CONSTANTE] Narrativa en desplegables para la sección "Sobre el proyecto".
 */
export const ABOUT_PROJECT_DATA: {
  tag: string;
  title: string;
  subtitle: string;
  items: AboutItem[];
  githubButtonText: string;
  contactButtonText: string;
} = {
  tag: 'Filosofía',
  title: 'Sobre el proyecto',
  subtitle: 'Breve narrativa sobre la génesis, el propósito comunitario y la visión detrás de CV Fácil.',
  items: [
    {
      id: 'origin',
      summary: '¿Cómo nació este proyecto?',
      body:
        'CV Fácil nació de la frustración real al ver cómo plataformas tradicionales cobran suscripciones abusivas o imprimen marcas de agua gigantescas sobre el esfuerzo de personas en búsqueda activa de empleo. Surgió como una iniciativa libre, pensada para devolverle la dignidad al proceso de postulación con herramientas accesibles y de calidad profesional.',
    },
    {
      id: 'problem',
      summary: '¿Qué problema resuelve?',
      body:
        'La mayoría de plantillas prediseñadas en Word o Canva poseen tablas invisibles y capas gráficas complejas que confunden a los analizadores automáticos (ATS), descartando hasta un 75% de los currículums antes de llegar a un humano. CV Fácil genera una jerarquía tipográfica limpia y semántica que los reclutadores y los algoritmos pueden leer sin errores.',
    },
    {
      id: 'solution',
      summary: '¿Cómo está pensada la solución?',
      body:
        'Bajo una arquitectura Local-First y BYOS (Bring Your Own Storage). Toda la edición y compilación del PDF A4 ocurre directamente en el navegador del usuario. Podés usar la herramienta en modo anónimo sin registrarte o conectar tu Google Drive para respaldar tus currículums sin intermediarios.',
    },
    {
      id: 'contribute',
      summary: '¿Cómo contribuir con ideas o código?',
      body:
        'CV Fácil es un proyecto de código abierto. Podés abrir un Issue o Pull Request en nuestro repositorio de GitHub sugiriendo plantillas, mejoras de accesibilidad o reportando errores. También podés sumarte difundiendo la herramienta entre colegas o invitando un cafecito para costear el mantenimiento.',
    },
  ],
  githubButtonText: 'GitHub Star',
  contactButtonText: '¿Necesitás una web? Contactame',
};

/**
 * [CONSTANTE] Bloque final de llamada a la acción (StartNow).
 */
export const START_NOW_DATA = {
  headline: 'Destacá con tu CV.',
  subheadline: 'Dejá de ser descartado por un bot.',
  ctaText: 'Creá tu CV',
  illustrationAlt:
    'Ilustración conceptual de un currículum destacándose con claridad sobre filtros automáticos',
};

/**
 * [CONSTANTE] Metadatos para el pie de página exclusivo de la Landing.
 */
export const FOOTER_DATA = {
  brandName: 'CV Fácil',
  tagline: 'Creá tu currículum profesional gratis, sin marcas de agua y con privacidad total.',
  licenseText: 'Código Abierto',
  authorText: 'Con mucho amor, by jotacé',
  countryText: 'Creado en Uruguay',
  year: new Date().getFullYear(),
};

/**
 * [CONSTANTE] Metadatos SEO para la Landing Page en voseo rioplatense.
 */
export const SEO_LANDING_DATA = {
  title: 'CV Fácil — Creá tu currículum gratis, fácil y rápido (PDF A4, sin marcas de agua)',
  description:
    'Armá tu CV online en minutos: elegí una plantilla, personalizala y descargalo en PDF. Gratis para siempre, sin registro y con tus datos en tu navegador o en tu Google Drive.',
};
