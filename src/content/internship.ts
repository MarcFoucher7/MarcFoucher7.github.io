import type { Localized } from '../i18n';

/** Contenu du stage ALL4TEC, repris de l'ancien portfolio. */
export const internship = {
  company: {
    fr: 'ALL4TEC (Changé), éditeur de logiciels spécialisé dans la gestion des risques cyber.',
    en: 'ALL4TEC (Changé, France), software publisher specialised in cyber-risk management.',
  },
  role: {
    fr: 'Développeur fullstack, en binôme.',
    en: 'Fullstack developer, working in a pair.',
  },
  stack: [
    'React',
    'TypeScript',
    'Colyseus (WebSockets)',
    'React Three Fiber',
    'Blender',
    'GitLab',
    'Tuleap',
  ],
  problem: {
    fr: "Transformer un jeu de plateau officiel et complexe, le serious game EBIOS Risk Manager, en jeu multijoueur en ligne où chaque action d'un joueur apparaît en temps réel chez les autres.",
    en: 'Turn an official and complex board game, the EBIOS Risk Manager serious game, into an online multiplayer game where every player action shows up for everyone else in real time.',
  },
  missions: [
    {
      title: { fr: 'Réseau et temps réel', en: 'Networking and real time' },
      points: [
        {
          fr: "Synchronisation d'état bidirectionnelle entre les clients React et le serveur Node.js avec Colyseus et les WebSockets.",
          en: 'Bidirectional state sync between React clients and a Node.js server using Colyseus and WebSockets.',
        },
        {
          fr: "Résilience au rechargement (F5) : sauvegarde d'un reconnectionToken en sessionStorage et boucle de reconnexion automatique.",
          en: 'Refresh resilience (F5): reconnectionToken cached in sessionStorage and an automatic reconnection loop.',
        },
        {
          fr: 'Découplage client-serveur grâce à des interfaces typées partagées (IState), sans conflit de compilation.',
          en: 'Client-server decoupling through shared typed interfaces (IState), with no compilation conflicts.',
        },
      ],
    },
    {
      title: { fr: 'Immersion 3D', en: 'Web 3D' },
      points: [
        {
          fr: 'Dés interactifs en 3D (4 et 20 faces) intégrés avec React Three Fiber.',
          en: 'Interactive 3D dice (D4 and D20) integrated with React Three Fiber.',
        },
        {
          fr: 'Retouche des modèles dans Blender : géométrie, axes de rotation, textures et matériaux.',
          en: 'Model clean-up in Blender: geometry, pivot axes, textures and materials.',
        },
        {
          fr: 'Animation du lancer par quaternions (slerp) pour un rendu réaliste qui masque la latence réseau.',
          en: 'Roll animation driven by quaternions (slerp), realistic enough to hide network latency.',
        },
      ],
    },
    {
      title: { fr: 'Interface', en: 'Interface' },
      points: [
        {
          fr: 'Transposition du plateau physique en interface web réactive avec CSS Grid et Flexbox.',
          en: 'Physical board turned into a responsive web interface with CSS Grid and Flexbox.',
        },
        {
          fr: 'Menu rétractable horizontal maquetté dans Figma puis développé sur mesure.',
          en: 'Horizontal collapsible menu designed in Figma, then built from scratch.',
        },
        {
          fr: 'Modales rendues avec React Portals pour éliminer les conflits de superposition.',
          en: 'Modals rendered through React Portals to remove stacking conflicts.',
        },
      ],
    },
    {
      title: { fr: 'Qualité et méthode', en: 'Quality and process' },
      points: [
        {
          fr: 'Typage strict sans any et documentation JSDoc systématique.',
          en: 'Strict typing with no any, and JSDoc on everything.',
        },
        {
          fr: "Configuration stricte d'ESLint et Prettier, plus de 330 alertes corrigées.",
          en: 'Strict ESLint and Prettier setup, more than 330 warnings fixed.',
        },
        {
          fr: 'Sprints Scrum bimensuels sur Tuleap, merge requests en équipe sur GitLab, essais de GitLab Duo.',
          en: 'Bi-weekly Scrum sprints on Tuleap, team merge requests on GitLab, trials of GitLab Duo.',
        },
      ],
    },
  ] satisfies { title: Localized; points: Localized[] }[],
  result: {
    fr: "Une version jouable, stable et validée par l'entreprise. Elle pose les bases d'un futur outil open source destiné à toute la communauté de la cybersécurité.",
    en: 'A playable, stable version validated by the company. It lays the foundation for a future open-source tool for the whole cybersecurity community.',
  },
  certification: {
    fr: "Certificat de réussite du MOOC d'introduction à la méthode EBIOS Risk Manager (Club EBIOS).",
    en: 'Completion certificate for the introduction to EBIOS Risk Manager MOOC (Club EBIOS).',
  },
  demoUrl: 'https://ebios-lejeu.all4tec.net/',
} satisfies Record<string, unknown>;
