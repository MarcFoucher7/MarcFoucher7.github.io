import type { Localized } from '../i18n';

export const links = {
  email: 'foucher.marc7@gmail.com',
  github: 'https://github.com/MarcFoucher7',
  linkedin: 'https://www.linkedin.com/in/marc-foucher-64397a38a/',
  cvFr: '/docs/cv-marc-foucher-fr.pdf',
  cvEn: '/docs/cv-marc-foucher-en.pdf',
  letter: '/docs/lettre-recommandation-all4tec.pdf',
  report: '/docs/rapport-stage-ebios-rm.pdf',
} as const;

export interface Project {
  title: Localized;
  tech: string;
  description: Localized;
  image: string;
  alt: Localized;
  /** TODO(Marc) : ajouter l'URL du dépôt GitHub quand il est public. */
  repo?: string;
}

export const projects: Project[] = [
  {
    title: { fr: 'Morpion', en: 'Tic-tac-toe' },
    tech: 'Java, JavaFX',
    description: {
      fr: 'Jeu de morpion avec une IA adverse et une interface graphique, structuré en MVC et en programmation orientée objet.',
      en: 'Tic-tac-toe with a computer opponent and a graphical interface, built with MVC and object-oriented programming.',
    },
    image: '/images/morpion.webp',
    alt: {
      fr: 'Grille de morpion avec une ligne gagnante et le message « Victoire : Marc »',
      en: 'Tic-tac-toe board with a winning line and the message “Victoire : Marc”',
    },
  },
  {
    title: { fr: 'Timeline Game', en: 'Timeline Game' },
    tech: 'JavaScript',
    description: {
      fr: 'Jeu de cartes chronologique en JavaScript, architecture MVC et logique de jeu fluide.',
      en: 'Chronology card game in JavaScript, with an MVC architecture and smooth game logic.',
    },
    image: '/images/timeline.webp',
    alt: {
      fr: 'Plateau du Timeline Game avec chronomètre, scores et main de cartes',
      en: 'Timeline Game board with a timer, scores and a hand of cards',
    },
  },
  {
    title: { fr: 'Robot de trading', en: 'Trading bot' },
    tech: 'Python',
    description: {
      fr: "Analyse des marchés financiers à partir d'une API de données, avec stockage en base de données.",
      en: 'Financial market analysis from a data API, with results stored in a database.',
    },
    image: '/images/trading.webp',
    alt: {
      fr: 'Graphique boursier en chandeliers avec des moyennes mobiles',
      en: 'Candlestick stock chart with moving averages',
    },
  },
  {
    title: { fr: 'Maquettes UX/UI', en: 'UX/UI mock-ups' },
    tech: 'Figma',
    description: {
      fr: "Conception de sites pour une entreprise de recyclage et pour un primeur, de l'arborescence aux maquettes.",
      en: 'Website design for a recycling company and a greengrocer, from site map to mock-ups.',
    },
    image: '/images/figma.webp',
    alt: {
      fr: 'Espace de travail Figma avec les pages du site du primeur',
      en: 'Figma workspace showing the greengrocer website pages',
    },
  },
];

export interface SkillGroup {
  title: Localized;
  items: Localized[];
}

const same = (text: string): Localized => ({ fr: text, en: text });

export const skills: SkillGroup[] = [
  {
    title: { fr: 'Web fullstack', en: 'Fullstack web' },
    items: ['TypeScript', 'React', 'JavaScript', 'HTML / CSS', 'PHP', 'Node.js'].map(same),
  },
  {
    title: { fr: 'Temps réel et 3D', en: 'Real time and 3D' },
    items: ['Colyseus (WebSockets)', 'React Three Fiber', 'Three.js', 'Blender'].map(same),
  },
  {
    title: { fr: 'Java', en: 'Java' },
    items: [
      { fr: 'Programmation orientée objet', en: 'Object-oriented programming' },
      same('MVC'),
      same('JavaFX'),
      same('Design patterns'),
    ],
  },
  {
    title: { fr: 'Bases de données', en: 'Databases' },
    items: [
      same('SQL'),
      same('MySQL'),
      same('SQL Server'),
      { fr: 'Modélisation MCD / MLD', en: 'Data modelling (CDM / LDM)' },
    ],
  },
  {
    title: { fr: 'Outils et méthode', en: 'Tools and process' },
    items: [
      same('Git, GitHub, GitLab'),
      same('Linux'),
      same('Docker'),
      same('Figma'),
      same('ESLint, Prettier'),
      { fr: 'Scrum (Tuleap)', en: 'Scrum (Tuleap)' },
    ],
  },
];

export interface TimelineEntry {
  when: Localized;
  title: Localized;
  detail: Localized;
  upcoming?: boolean;
}

/** Parcours, du plus ancien au plus récent. */
export const timeline: TimelineEntry[] = [
  {
    when: { fr: 'Lycée', en: 'High school' },
    title: { fr: 'Baccalauréat général, mention Bien', en: 'French baccalaureate, with honours' },
    detail: { fr: 'Spécialités mathématiques et physique.', en: 'Mathematics and physics.' },
  },
  {
    when: { fr: 'En cours', en: 'Current' },
    title: { fr: 'BUT Informatique, IUT de Laval', en: 'BUT Computer Science, IUT Laval' },
    detail: {
      fr: 'Java et JavaScript approfondis, méthodes agiles (Scrum) et de nombreux projets encadrés.',
      en: 'In-depth Java and JavaScript, Agile methods (Scrum) and many supervised projects.',
    },
  },
  {
    when: { fr: 'Avril à juillet 2026', en: 'April to July 2026' },
    title: { fr: 'Stage chez ALL4TEC', en: 'Internship at ALL4TEC' },
    detail: {
      fr: 'Développeur fullstack sur le serious game EBIOS RM en ligne.',
      en: 'Fullstack developer on the online EBIOS RM serious game.',
    },
  },
  {
    when: { fr: '2026-2027', en: '2026-2027' },
    title: { fr: 'Alternance en 3e année de BUT', en: 'Work-study, third year of BUT' },
    detail: {
      fr: 'Je cherche l’entreprise qui m’accueillera.',
      en: "I'm looking for the company that will host me.",
    },
    upcoming: true,
  },
];

export const certifications: Localized[] = [
  { fr: 'TOEIC Listening, niveau B2', en: 'TOEIC Listening, B2 level' },
  {
    fr: 'Projet Voltaire, niveau Affaires',
    en: 'Projet Voltaire (French writing), Business level',
  },
  {
    fr: 'MOOC EBIOS Risk Manager, Club EBIOS',
    en: 'EBIOS Risk Manager MOOC, Club EBIOS',
  },
];

export interface BeyondEntry {
  title: Localized;
  duration?: Localized;
  detail?: Localized;
}

export const beyond: BeyondEntry[] = [
  {
    title: { fr: 'Vendeur sur les marchés', en: 'Market vendor' },
    duration: { fr: '5 ans', en: '5 years' },
    detail: {
      fr: '« Passionnés des huîtres » et « Chez Naïm » : relation client, autonomie, ponctualité.',
      en: '“Passionnés des huîtres” and “Chez Naïm”: customer relations, autonomy, punctuality.',
    },
  },
  {
    title: { fr: 'Batterie', en: 'Drums' },
    duration: { fr: '9 ans de pratique', en: '9 years of practice' },
  },
  {
    title: { fr: 'Handball', en: 'Handball' },
    duration: { fr: 'Sport collectif', en: 'Team sport' },
  },
];
