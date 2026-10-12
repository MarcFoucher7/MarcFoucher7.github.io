/** Chaînes d'interface en français. Le contenu (projets, stage…) vit dans src/content. */
export const fr = {
  meta: {
    title: 'Marc Foucher, développeur fullstack en alternance',
    description:
      "Portfolio de Marc Foucher, étudiant en BUT Informatique à l'IUT de Laval. Temps réel, TypeScript strict et 3D web. Recherche d'alternance 2026-2027.",
  },
  nav: {
    label: 'Navigation principale',
    home: 'Accueil',
    stage: 'Stage',
    projects: 'Projets',
    skills: 'Compétences',
    background: 'Parcours',
    contact: 'Contact',
    dossier: 'Dossier S3',
    menu: 'Menu',
    close: 'Fermer le menu',
    cv: 'CV',
  },
  toggles: {
    lang: 'English',
    langLabel: 'Switch to English',
    themeToDark: 'Passer au thème sombre',
    themeToLight: 'Passer au thème clair',
    dark: 'Sombre',
    light: 'Clair',
  },
  status: {
    connecting: 'Connexion au serveur…',
    reconnecting: 'Reconnexion avec le token de session…',
    connected: 'Connecté',
    syncs: (n: number) => (n <= 1 ? `${n} état synchronisé` : `${n} états synchronisés`),
  },
  hero: {
    role: 'Développeur fullstack',
    lead: "Étudiant en BUT Informatique à l'IUT de Laval, je cherche une alternance pour 2026-2027. Mon terrain de jeu : le temps réel, le TypeScript strict et la 3D dans le navigateur.",
    cv: 'Télécharger mon CV',
    contact: 'Me contacter',
    letter: 'Lettre de recommandation',
  },
  stage: {
    title: 'Stage chez ALL4TEC',
    subtitle: 'Adaptation en ligne du serious game EBIOS Risk Manager',
    period: 'Avril à juillet 2026, 3 mois',
    company: 'Entreprise',
    role: 'Rôle',
    stack: 'Technologies',
    problem: 'Le défi',
    built: 'Ce que j’ai construit',
    result: 'Résultat',
    demo: 'Tester la démo en ligne',
    letter: 'Lire la recommandation de mon tuteur',
    report: 'Rapport de stage (PDF, 21 Mo)',
    certification: 'Certification',
  },
  projects: {
    title: 'Projets',
    intro: 'Projets réalisés à l’IUT et en autonomie.',
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
    title: 'Discutons de votre alternance',
    lead: 'Je réponds rapidement par mail. Mon CV est disponible en français et en anglais.',
    cvFr: 'CV en français',
    cvEn: 'CV en anglais',
  },
  footer: {
    hosted: 'Hébergé sur GitHub Pages',
    dossier: 'Dossier académique S3',
    top: 'Revenir en haut',
  },
  fallback: 'Illustration : deux clients synchronisés en temps réel',
  skip: 'Aller au contenu',
  newTab: '(nouvel onglet)',
};

export type Dictionary = typeof fr;
