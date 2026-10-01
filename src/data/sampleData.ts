import type { CVData } from '../types/cv';

export const sampleData: CVData = {
  profile: {
    fullName: 'Alejandro Morales',
    headline: 'Senior Full Stack Engineer & Cloud Architect',
    email: 'alejandro.morales@devmail.io',
    phone: '+34 612 345 678',
    location: 'Madrid, España (Remoto)',
    website: 'https://amorales.dev',
    linkedin: 'linkedin.com/in/amorales-dev',
    github: 'github.com/amorales-code',
    summary: 'Ingeniero de software con más de 7 años de experiencia diseñando arquitecturas escalables, sistemas distribuidos y aplicaciones web de alto rendimiento. Apasionado por las mejores prácticas (SDD, TDD, Clean Architecture), la experiencia de desarrollo moderna y la infraestructura cloud-native.',
    avatarUrl: ''
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'TechFlow Solutions',
      role: 'Staff Software Engineer',
      location: 'Madrid / Remoto',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description: '• Liderazgo técnico del equipo de plataforma core, reduciendo la latencia de renderizado en un 40% mediante arquitecturas de islas y SSR híbrido.\n• Diseño e implementación de pipelines CI/CD y despliegues zero-downtime en Kubernetes con AWS.\n• Mentoría técnica a 8 ingenieros e impulso de la metodología Spec-Driven Development (SDD) para reducir el retrabajo en un 35%.'
    },
    {
      id: 'exp-2',
      company: 'NovaWave Digital',
      role: 'Senior Frontend Engineer',
      location: 'Barcelona, España',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      description: '• Desarrollo de aplicaciones web complejas utilizando React, TypeScript, Next.js y Tailwind CSS.\n• Creación de un Design System corporativo utilizado en más de 12 productos digitales con estricta conformidad de accesibilidad WCAG AA.\n• Optimización de Core Web Vitals alcanzando scores de 98+ en métricas LCP y CLS.'
    },
    {
      id: 'exp-3',
      company: 'InnovaLab Studio',
      role: 'Full Stack Developer',
      location: 'Valencia, España',
      startDate: '2017-09',
      endDate: '2019-05',
      current: false,
      description: '• Construcción de APIs REST y GraphQL robustas con Node.js, Express y bases de datos PostgreSQL.\n• Implementación de pasarelas de pago y sistemas de autenticación OAuth2 / JWT para plataformas e-commerce.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Universidad Politécnica de Madrid',
      degree: 'Grado en Ingeniería del Software',
      fieldOfStudy: 'Ciencias de la Computación',
      startDate: '2013-09',
      endDate: '2017-06',
      description: 'Graduado con Mención de Honor en Sistemas Distribuidos y Arquitectura de Software.'
    }
  ],
  skills: [
    { id: 'sk-1', name: 'TypeScript / JavaScript', level: 'advanced' },
    { id: 'sk-2', name: 'React / Next.js / Astro', level: 'advanced' },
    { id: 'sk-3', name: 'Node.js / Express', level: 'advanced' },
    { id: 'sk-4', name: 'Tailwind CSS & Design Systems', level: 'advanced' },
    { id: 'sk-5', name: 'PostgreSQL & Redis', level: 'intermediate' },
    { id: 'sk-6', name: 'Docker & Kubernetes', level: 'intermediate' },
    { id: 'sk-7', name: 'AWS Cloud Architecture', level: 'intermediate' },
    { id: 'sk-8', name: 'GraphQL & gRPC', level: 'intermediate' },
    { id: 'sk-9', name: 'Python & FastAPI', level: 'basic' },
    { id: 'sk-10', name: 'Rust', level: 'basic' }
  ],
  languages: [
    { id: 'lang-1', name: 'Español', level: 'Nativo' },
    { id: 'lang-2', name: 'Inglés', level: 'C1 Profesional Completo' },
    { id: 'lang-3', name: 'Francés', level: 'B1 Intermedio' }
  ],
  settings: {
    templateId: 'modern',
    accentColor: '#1e40af',
    fontFamily: 'sans',
    showIcons: true
  }
};
