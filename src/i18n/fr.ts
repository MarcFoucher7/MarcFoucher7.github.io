/** Chaînes d'interface en français. Le contenu (projets, stage…) vit dans src/content. */
export const fr = {
  meta: {
    title: 'Marc Foucher, développeur fullstack en alternance',
    description:
      "Portfolio de Marc Foucher, étudiant en BUT Informatique à l'IUT de Laval. Temps réel, TypeScript strict et 3D web. Recherche d'alternance 2026-2027.",
  },
  skip: 'Aller au contenu',
  newTab: '(nouvel onglet)',
  preloader: {
    label: 'Chargement de la scène',
    edition: 'Portfolio, édition 2026',
  },
  header: {
    home: 'Marc Foucher, retour en haut',
    place: 'Laval, FR',
    available: 'Ouvert à une alternance 2026-27',
    menu: 'Menu',
    close: 'Fermer',
    sound: 'Son',
    soundOn: 'Couper le son de la cymbale',
    soundOff: 'Activer le son de la cymbale',
  },
  menu: {
    label: 'Navigation principale',
    links: {
      stage: 'Étude de cas',
      projects: 'Projets',
      skills: 'Compétences',
      background: 'Parcours',
      contact: 'Contact',
    },
    dossier: 'Dossier S3',
    theme: 'Thème',
    themeDark: 'Sombre',
    themeLight: 'Clair',
    lang: 'Langue',
    cv: 'Télécharger le CV',
  },
  toggles: {
    langLabel: 'Switch to English',
    themeToDark: 'Passer au thème sombre',
    themeToLight: 'Passer au thème clair',
  },
  hero: {
    kicker: 'Développeur fullstack',
    intro:
      "Étudiant en BUT Informatique à l'IUT de Laval. Je cherche une alternance pour 2026-2027.",
    tags: 'React, TypeScript, temps réel, 3D',
    scroll: 'Défiler',
    hit: 'Batteur depuis 9 ans. Cliquez pour frapper la cymbale.',
    cv: 'CV',
  },
  manifesto:
    "Je construis des interfaces web qui restent synchronisées en temps réel, typées sans compromis, et en trois dimensions quand ça sert l'expérience.",
  stage: {
    label: 'Étude de cas',
    title: 'EBIOS RM, en ligne',
    companyLabel: 'Entreprise',
    periodLabel: 'Période',
    roleLabel: 'Rôle',
    stackLabel: 'Technologies',
    period: 'Avril à juillet 2026 (3 mois)',
    role: 'Développeur fullstack, en binôme',
    problem: 'Le défi',
    progress: (n: number, total: number) => `Étape ${n} sur ${total}`,
    hint: 'Clin d’œil aux dés 3D de ce stage : un D20 roule à chaque étape.',
    result: 'Résultat',
    demo: 'Tester la démo',
    letter: 'Recommandation du tuteur',
    report: 'Rapport de stage (PDF, 21 Mo)',
    certification: 'Certification',
  },
  projects: {
    title: 'Projets',
    view: 'Voir',
    repoTodo: 'Code source bientôt en ligne',
  },
  skills: {
    title: 'Compétences',
  },
  background: {
    title: 'Parcours',
    certifications: 'Certifications',
  },
  beyond: {
    title: 'À côté du code',
  },
  contact: {
    kicker: 'Une alternance pour 2026-2027 ?',
    title: ['Travaillons', 'ensemble'],
    write: 'Écrire',
    cvFr: 'CV en français',
    cvEn: 'CV en anglais',
    localTime: 'Heure locale',
  },
  footer: {
    dossier: 'Dossier académique S3',
    top: 'Haut de page',
  },
  fallback: 'Illustration : nuage de points',
};

export type Dictionary = typeof fr;
