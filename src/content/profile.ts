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
  /** Visuel 16:10 (WebP), aussi affiché sur l'écran du studio en 3D. */
  image: string;
  alt: Localized;
  /** URL d'un dépôt public. Absent : pas de lien affiché. */
  repo?: string;
  /** Projet mis en avant (grande ligne) ; les autres sont listés en format compact. */
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: { fr: 'TrachVR', en: 'TrachVR' },
    tech: 'Unity, C#, XR Interaction Toolkit, URP, Android',
    description: {
      fr: 'SAÉ de BUT3, en équipe. Simulation de trachéotomie pour Meta Quest : bloc opératoire virtuel, scénario pédagogique en douze étapes, détection des erreurs et retour haptique.',
      en: 'Third-year team project. A tracheotomy simulation for Meta Quest: virtual operating room, twelve-step training scenario, error detection and haptic feedback.',
    },
    image: '/images/trachvr.webp',
    alt: {
      fr: 'Rendus 3D du projet TrachVR : le modèle du patient et la trachée avec la canule en place',
      en: 'TrachVR 3D renders: the patient model and the trachea with the tube in place',
    },
    // TODO(Marc) : dépôt privé github.com/Baptiste443/TrachVR. Le passer en public pour l'ajouter ici.
    featured: true,
  },
  {
    title: { fr: 'AI Coding Assistant', en: 'AI Coding Assistant' },
    tech: 'Python 3.12, FastAPI, JavaScript, pytest',
    description: {
      fr: 'R5.05, en équipe de trois. On dépose un projet Python (.py ou .zip de 10 Mo maximum, décompression sécurisée) et sa stack trace : analyse déterministe du traceback, diff côte à côte, pytest relancé en sous-processus isolé avec timeout et liste blanche de commandes. Git Flow et Conventional Commits.',
      en: 'R5.05 team project (three people). Upload a Python project (.py or .zip up to 10 MB, safely extracted) with its stack trace: deterministic traceback analysis, side-by-side diff, pytest rerun in an isolated subprocess with a timeout and a command allow-list. Git Flow and Conventional Commits.',
    },
    image: '/images/ai-coding-assistant.webp',
    alt: {
      fr: "Interface de l'assistant : une erreur IndexError collée et son explication en trois points",
      en: 'Assistant interface: a pasted IndexError and its three-point explanation',
    },
    // TODO(Marc) : dépôt privé github.com/Ynryo/r55-g6-assistant-ia. Le passer en public pour l'ajouter ici.
    featured: true,
  },
  {
    title: { fr: 'Plateforme DevOps auto-hébergée', en: 'Self-hosted DevOps platform' },
    tech: 'GitLab CE, GitLab CI/CD, Docker, Docker-in-Docker, Tailscale',
    description: {
      fr: "R5.09, en équipe. Serveur GitLab avec runners et registry. Pipelines .gitlab-ci.yml appliqués à l'application LogisticoTrain (React, API REST, API temps réel, docker-compose, trois rôles métier). Tailscale sert à contourner le proxy de l'IUT.",
      en: 'R5.09 team project. A GitLab server with runners and a container registry. .gitlab-ci.yml pipelines applied to the LogisticoTrain app (React, REST API, real-time API, docker-compose, three business roles). Tailscale gets around the university proxy.',
    },
    // TODO(Marc) : visuel provisoire (illustration). Remplacer par une capture des pipelines.
    image: '/images/devops-gitlab.webp',
    alt: {
      fr: 'Illustration : pipeline build, test, image, déploiement',
      en: 'Illustration: build, test, image and deploy pipeline',
    },
    // TODO(Marc) : dépôt hébergé sur le GitLab du groupe, pas de lien public.
    featured: true,
  },
  {
    title: { fr: 'Automatisation RPA du recrutement', en: 'Recruitment RPA' },
    tech: 'Robot Framework, Python',
    description: {
      fr: "R5.07. Tri automatique de CV selon les critères d'une offre, puis notification par mail des candidats retenus. Suite de tests E2E sur une boutique web : commande, navigation, recherche, utilisateurs.",
      en: "R5.07 project. Automatic CV screening against a job offer's criteria, then email notifications to the shortlisted candidates. End-to-end test suite for an online shop: ordering, navigation, search, users.",
    },
    // TODO(Marc) : visuel provisoire (illustration). Remplacer par une capture du robot ou des rapports.
    image: '/images/rpa-recrutement.webp',
    alt: {
      fr: 'Illustration : CV triés, un retenu, et un mail de notification',
      en: 'Illustration: sorted CVs, one shortlisted, and a notification email',
    },
    // TODO(Marc) : dépôt introuvable sur GitHub.
    featured: true,
  },
  {
    title: { fr: 'Aviatech', en: 'Aviatech' },
    tech: 'Processing (Android), Arduino Nano WiFi',
    description: {
      fr: 'Projet perso. Avion RC motorisé piloté depuis une tablette, avec une app pilote et une app surveillant.',
      en: 'Personal project. A motorised RC plane flown from a tablet, with a pilot app and a supervisor app.',
    },
    // TODO(Marc) : visuel provisoire (illustration) et dépôt introuvable sur GitHub.
    image: '/images/aviatech.webp',
    alt: {
      fr: 'Illustration : un avion et une tablette reliés en WiFi',
      en: 'Illustration: a plane and a tablet linked over WiFi',
    },
  },
  {
    title: { fr: 'MyDressing', en: 'MyDressing' },
    tech: 'Swift, SwiftUI, SwiftData, MVVM',
    description: {
      fr: 'Projet perso. App macOS native de gestion de garde-robe.',
      en: 'Personal project. A native macOS app to manage a wardrobe.',
    },
    // TODO(Marc) : visuel provisoire (illustration) et dépôt introuvable sur GitHub.
    image: '/images/mydressing.webp',
    alt: {
      fr: 'Illustration : une fenêtre macOS et un cintre',
      en: 'Illustration: a macOS window and a clothes hanger',
    },
  },
  {
    title: { fr: 'Perudo', en: 'Perudo' },
    tech: 'Kotlin, Android',
    description: {
      fr: 'BUT2. Jeu de dés avec lobby, écran de règles et gestion de la musique.',
      en: 'Second-year project. A dice game with a lobby, a rules screen and music settings.',
    },
    // TODO(Marc) : visuel provisoire (illustration) et dépôt introuvable sur GitHub.
    image: '/images/perudo.webp',
    alt: {
      fr: 'Illustration : cinq dés et un gobelet',
      en: 'Illustration: five dice and a cup',
    },
  },
  {
    title: { fr: 'Timeline Game', en: 'Timeline Game' },
    tech: 'Java, JavaFX, Maven',
    description: {
      fr: 'Jeu de cartes chronologique en Java, avec une interface JavaFX et une architecture MVC.',
      en: 'A chronology card game in Java, with a JavaFX interface and an MVC architecture.',
    },
    image: '/images/timeline.webp',
    alt: {
      fr: 'Plateau du Timeline Game avec chronomètre, scores et main de cartes',
      en: 'Timeline Game board with a timer, scores and a hand of cards',
    },
    // TODO(Marc) : dépôt introuvable sur GitHub.
  },
];

export interface SkillGroup {
  title: Localized;
  items: Localized[];
}

const same = (text: string): Localized => ({ fr: text, en: text });

/**
 * Compétences techniques, sans doublons. Chaque groupe est porté par une pièce
 * de la batterie dans la vue éclatée (voir src/content/kit.ts).
 */
export const skills: SkillGroup[] = [
  {
    title: { fr: 'Langages', en: 'Languages' },
    items: [
      { fr: 'Java : POO, MVC, JavaFX', en: 'Java: OOP, MVC, JavaFX' },
      same('Design patterns'),
      same('Python (FastAPI)'),
      same('Kotlin'),
      same('C#'),
      same('Swift'),
    ],
  },
  {
    title: { fr: 'Web fullstack', en: 'Fullstack web' },
    items: [
      'TypeScript, JavaScript',
      'React',
      'Node.js',
      'PHP, Symfony',
      'HTML / CSS',
      'Figma',
    ].map(same),
  },
  {
    title: { fr: '3D, XR et temps réel', en: '3D, XR and real time' },
    items: [
      'React Three Fiber, Three.js',
      'Blender',
      'Unity',
      'XR Interaction Toolkit',
      'Colyseus (WebSockets)',
    ].map(same),
  },
  {
    title: { fr: 'Données', en: 'Data' },
    items: [
      { fr: 'SQL : MySQL, SQL Server, SQLite', en: 'SQL: MySQL, SQL Server, SQLite' },
      same('Redis'),
      same('Elasticsearch, Kibana'),
      { fr: 'Modélisation MCD / MLD', en: 'Data modelling (CDM / LDM)' },
    ],
  },
  {
    title: { fr: 'Tests, qualité et méthode', en: 'Testing, quality and process' },
    items: [
      same('pytest'),
      same('Robot Framework'),
      same('ESLint, Prettier'),
      { fr: 'Hooks Git, Conventional Commits', en: 'Git hooks, Conventional Commits' },
      same('Lighthouse CI'),
      same('Scrum (Tuleap)'),
    ],
  },
  {
    title: { fr: 'DevOps', en: 'DevOps' },
    items: [
      same('Git, GitHub, GitLab'),
      same('GitLab CI/CD'),
      same('Docker, Docker Compose'),
      same('Docker-in-Docker'),
      same('Linux'),
      same('Tailscale'),
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
    when: { fr: 'Avril à juillet 2026', en: 'April to July 2026' },
    title: { fr: 'Stage chez ALL4TEC', en: 'Internship at ALL4TEC' },
    detail: {
      fr: 'Développeur fullstack sur le serious game EBIOS RM en ligne.',
      en: 'Fullstack developer on the online EBIOS RM serious game.',
    },
  },
  {
    when: { fr: 'En cours, 2026-2027', en: 'Current, 2026-2027' },
    title: { fr: 'BUT3 Informatique, IUT de Laval', en: 'BUT3 Computer Science, IUT Laval' },
    detail: {
      fr: 'Parcours « Réalisation d’applications : conception, développement, validation ». Projets en DevOps, qualité et tests, XR et IA.',
      en: 'Application design, development and validation track. Projects in DevOps, testing and quality, XR and AI.',
    },
  },
  // TODO(Marc) : confirmer « toujours en recherche », ou indiquer l'entreprise et le poste.
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
  { fr: 'TOEIC Listening B2', en: 'TOEIC Listening B2' },
  { fr: 'Projet Voltaire, niveau Affaires', en: 'Projet Voltaire (French), Business level' },
  { fr: 'MOOC EBIOS RM, Club EBIOS', en: 'EBIOS RM MOOC, Club EBIOS' },
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
