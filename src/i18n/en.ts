import type { Dictionary } from './fr';

/** Interface strings in English. Content lives in src/content. */
export const en: Dictionary = {
  meta: {
    title: 'Marc Foucher, fullstack developer looking for a work-study position',
    description:
      'Portfolio of Marc Foucher, Computer Science student (BUT) at IUT Laval, France. Real-time, strict TypeScript and web 3D. Looking for a 2026-2027 work-study position.',
  },
  nav: {
    label: 'Main navigation',
    home: 'Home',
    stage: 'Internship',
    projects: 'Projects',
    skills: 'Skills',
    background: 'Background',
    contact: 'Contact',
    dossier: 'S3 file',
    menu: 'Menu',
    close: 'Close menu',
    cv: 'Resume',
  },
  toggles: {
    lang: 'Français',
    langLabel: 'Passer en français',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
    dark: 'Dark',
    light: 'Light',
  },
  status: {
    connecting: 'Connecting to server…',
    reconnecting: 'Reconnecting with the session token…',
    connected: 'Connected',
    syncs: (n: number) => (n === 1 ? `${n} state synced` : `${n} states synced`),
  },
  hero: {
    role: 'Fullstack developer',
    lead: 'Computer Science student at IUT Laval, France, looking for a work-study position for 2026-2027. What I enjoy most: real-time systems, strict TypeScript and 3D in the browser.',
    cv: 'Download my resume',
    contact: 'Contact me',
    letter: 'Recommendation letter',
  },
  stage: {
    title: 'Internship at ALL4TEC',
    subtitle: 'Online adaptation of the EBIOS Risk Manager serious game',
    period: 'April to July 2026, 3 months',
    company: 'Company',
    role: 'Role',
    stack: 'Technologies',
    problem: 'The challenge',
    built: 'What I built',
    result: 'Outcome',
    demo: 'Try the live demo',
    letter: "Read my supervisor's recommendation",
    report: 'Internship report (PDF, 21 MB, French)',
    certification: 'Certification',
  },
  projects: {
    title: 'Projects',
    intro: 'Projects built at university and on my own.',
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
    title: "Let's talk about your work-study position",
    lead: 'I reply quickly by email. My resume is available in English and French.',
    cvFr: 'Resume in French',
    cvEn: 'Resume in English',
  },
  footer: {
    hosted: 'Hosted on GitHub Pages',
    dossier: 'S3 academic file',
    top: 'Back to top',
  },
  fallback: 'Illustration: two clients kept in sync in real time',
  skip: 'Skip to content',
  newTab: '(new tab)',
};
