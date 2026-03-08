export const PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    commission: '2%',
    desc: 'Perfect for testing your first idea.',
    features: [
      '1 AI generated store',
      'Maximum 5 products',
      'Basic AI Store Builder',
      'Basic store customization',
      'Basic dashboard',
      'Basic analytics',
      'PayPal payments supported',
      'English and French interface'
    ],
    limitations: [
      'No advanced reports',
      'No AI supplier recommendations',
      'Limited AI generation'
    ],
    buttonText: 'Start Free',
    descFr: 'Parfait pour tester votre première idée.',
    featuresFr: [
      '1 boutique générée par IA',
      'Maximum 5 produits',
      'Constructeur de boutique IA de base',
      'Personnalisation de base',
      'Tableau de bord de base',
      'Analyses de base',
      'Paiements PayPal supportés',
      'Interface anglais et français'
    ],
    limitationsFr: [
      'Pas de rapports avancés',
      'Pas de recommandations de fournisseurs IA',
      'Génération IA limitée'
    ],
    buttonTextFr: 'Commencer Gratuitement',
    popular: false
  },
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 10,
    commission: '1%',
    desc: 'For growing businesses ready to scale.',
    descFr: 'Pour les entreprises en croissance prêtes à passer à l\'échelle.',
    features: [
      'Up to 3 stores',
      'Up to 50 products',
      'Full AI Store Builder',
      'Chat-based store editing',
      'Store design customization',
      'Basic reports',
      'Analytics dashboard',
      'Generate 1 AI store in 60 seconds per month'
    ],
    featuresFr: [
      'Jusqu\'à 3 boutiques',
      'Jusqu\'à 50 produits',
      'Constructeur de boutique IA complet',
      'Édition de boutique par chat',
      'Personnalisation du design',
      'Rapports de base',
      'Tableau de bord analytique',
      'Générer 1 boutique IA par mois'
    ],
    buttonText: 'Upgrade to Starter',
    buttonTextFr: 'Passer au Starter',
    limitations: [],
    limitationsFr: [],
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 29.99,
    commission: '0%',
    desc: 'For serious entrepreneurs building an empire.',
    descFr: 'Pour les entrepreneurs sérieux bâtissant un empire.',
    features: [
      'Unlimited stores',
      'Unlimited products',
      'Advanced analytics dashboard',
      'Advanced reports',
      'AI business suggestions',
      'AI marketing recommendations',
      'Generate up to 5 AI stores in 60 seconds per month',
      'AI Supplier Finder (Suggest up to 5 suppliers)'
    ],
    featuresFr: [
      'Boutiques illimitées',
      'Produits illimités',
      'Tableau de bord analytique avancé',
      'Rapports avancés',
      'Suggestions d\'affaires IA',
      'Recommandations marketing IA',
      'Générer jusqu\'à 5 boutiques IA par mois',
      'Recherche de fournisseurs IA (jusqu\'à 5)'
    ],
    buttonText: 'Upgrade to Pro',
    buttonTextFr: 'Passer au Pro',
    limitations: [],
    limitationsFr: [],
    popular: true
  },
  {
    id: 'ultra',
    name: 'Ultra Plan',
    price: 49.99,
    commission: '0%',
    desc: 'Scale your business to the moon with intelligence.',
    descFr: 'Faites décoller votre entreprise avec l\'intelligence.',
    features: [
      'Everything included in Pro',
      'Priority AI store generation',
      'Advanced automation tools',
      'Premium AI business insights',
      'Generate up to 8 AI stores in 60 seconds per month',
      'Advanced AI Supplier Intelligence (Ranked list)'
    ],
    featuresFr: [
      'Tout ce qui est inclus dans Pro',
      'Génération de boutique IA prioritaire',
      'Outils d\'automatisation avancés',
      'Aperçus d\'affaires IA Premium',
      'Générer jusqu\'à 8 boutiques IA par mois',
      'Intelligence Fournisseur IA avancée (liste classée)'
    ],
    buttonText: 'Upgrade to Ultra',
    buttonTextFr: 'Passer à l\'Ultra',
    limitations: [],
    limitationsFr: [],
    popular: false
  }
];
