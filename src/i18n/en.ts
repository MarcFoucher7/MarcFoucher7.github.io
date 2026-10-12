import type { Dictionary } from './fr';

/** Interface strings in English. Content lives in src/content. */
export const en: Dictionary = {
  meta: {
    title: 'Marc Foucher, fullstack developer looking for a work-study position',
    description:
      'Portfolio of Marc Foucher, Computer Science student (BUT) at IUT Laval, France. Real-time, strict TypeScript and web 3D. Looking for a 2026-2027 work-study position.',
  },
  skip: 'Skip to content',
  newTab: '(new tab)',
  preloader: {
    label: 'Loading the scene',
    edition: 'Portfolio, 2026 edition',
  },
  header: {
    home: 'Marc Foucher, back to top',
    place: 'Laval, FR',
    available: 'Open to a 2026-27 work-study',
    menu: 'Menu',
    close: 'Close',
  },
  menu: {
    label: 'Main navigation',
    links: {
      stage: 'Case study',
      projects: 'Projects',
      skills: 'Skills',
      background: 'Background',
      contact: 'Contact',
    },
    dossier: 'S3 file',
    theme: 'Theme',
    themeDark: 'Dark',
    themeLight: 'Light',
    lang: 'Language',
    cv: 'Download resume',
  },
  toggles: {
    langLabel: 'Passer en français',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
  },
  hero: {
    kicker: 'Fullstack developer',
    intro:
      'Computer Science student at IUT Laval, France. Looking for a work-study position for 2026-2027.',
    tags: 'React, TypeScript, real time, 3D',
    scroll: 'Scroll',
    cv: 'Resume',
  },
  manifesto:
    'I build web interfaces that stay in sync in real time, typed without compromise, and in three dimensions when it serves the experience.',
  stage: {
    label: 'Case study',
    title: 'EBIOS RM, online',
    companyLabel: 'Company',
    periodLabel: 'Period',
    roleLabel: 'Role',
    stackLabel: 'Technologies',
    period: 'April to July 2026 (3 months)',
    role: 'Fullstack developer, in a pair',
    problem: 'The challenge',
    progress: (n: number, total: number) => `Step ${n} of ${total}`,
    hint: 'A nod to the 3D dice from this internship: a D20 rolls at every step.',
    result: 'Outcome',
    demo: 'Try the demo',
    letter: "Supervisor's recommendation",
    report: 'Internship report (PDF, 21 MB, French)',
    certification: 'Certification',
  },
  projects: {
    title: 'Projects',
    view: 'View',
    repoTodo: 'Source code coming soon',
  },
  skills: {
    title: 'Skills',
  },
  background: {
    title: 'Background',
    certifications: 'Certifications',
  },
  beyond: {
    title: 'Beyond code',
  },
  contact: {
    kicker: 'A work-study position for 2026-2027?',
    title: ["Let's work", 'together'],
    write: 'Write',
    cvFr: 'Resume in French',
    cvEn: 'Resume in English',
    localTime: 'Local time',
  },
  footer: {
    dossier: 'S3 academic file',
    top: 'Back to top',
  },
  fallback: 'Illustration: point cloud',
};
