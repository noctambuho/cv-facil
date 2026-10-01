import type { CVData } from '../types/cv';

export const initialData: CVData = {
  profile: {
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
    avatarUrl: ''
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  settings: {
    templateId: 'modern',
    accentColor: '#1e40af',
    fontFamily: 'sans',
    showIcons: true
  }
};
