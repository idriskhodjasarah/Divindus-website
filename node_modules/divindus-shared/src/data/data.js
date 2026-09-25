export const CATEGORIES = [
  { id: "all", label: "Tout" },
  { id: "capref", label: "Cabines & chalets" },
  { id: "mcm", label: "Mobilier & construction métallique" },
  { id: "wood", label: "Bois & panneaux" },
  { id: "zi", label: "Zones industrielles" },
];

export const PRODUCTS = [
  {
    id: "CAP-25-01",
    name: "Cabine préfabriquée CABINE 2025",
    filiale: "DIVINDUS Capref",
    category: "capref",
    price: 685000,
    unit: "unité",
    lead: "4 à 6 semaines",
    desc: "Cabine modulaire en panneaux sandwich isolés, montage rapide sur site, personnalisable en surface et ouvertures.",
    spec: ["Surface : 15 à 40 m²", "Ossature acier galvanisé", "Isolation thermique et phonique"],
  },
  {
    id: "CAP-25-02",
    name: "Chalet modulaire Sahel",
    filiale: "DIVINDUS Capref",
    category: "capref",
    price: 1240000,
    unit: "unité",
    lead: "6 à 8 semaines",
    desc: "Chalet à ossature bois et bardage extérieur, conçu pour les sites de vie de chantier et l'hébergement collectif.",
    spec: ["Surface : jusqu'à 60 m²", "Bardage bois ou composite", "Raccordement eau/électricité prévu"],
  },
  {
    id: "MCM-14-07",
    name: "Armoire métallique de bureau",
    filiale: "DIVINDUS MCM",
    category: "mcm",
    price: 38500,
    unit: "unité",
    lead: "10 jours",
    desc: "Armoire de rangement en tôle d'acier, 2 portes battantes, 4 tablettes réglables.",
    spec: ["Dimensions : 180 x 90 x 40 cm", "Serrure à clé", "Peinture époxy"],
  },
  {
    id: "MCM-14-12",
    name: "Rayonnage industriel modulable",
    filiale: "DIVINDUS MCM",
    category: "mcm",
    price: 22900,
    unit: "travée",
    lead: "10 jours",
    desc: "Rayonnage à charge lourde pour entrepôts et ateliers, montage sans boulonnage.",
    spec: ["Charge : 350 kg / niveau", "Hauteur : 200 à 300 cm", "5 niveaux réglables"],
  },
  {
    id: "MCM-14-19",
    name: "Charpente métallique industrielle",
    filiale: "DIVINDUS MCM",
    category: "mcm",
    price: null,
    unit: "sur devis",
    lead: "selon projet",
    desc: "Étude et fabrication de charpentes pour halls industriels, entrepôts et hangars agricoles.",
    spec: ["Calcul de structure inclus", "Portées jusqu'à 30 m", "Pose par nos équipes"],
  },
  {
    id: "WM-08-03",
    name: "Bureau bois massif Direction",
    filiale: "Wood Manufacture",
    category: "wood",
    price: 96000,
    unit: "unité",
    lead: "3 semaines",
    desc: "Bureau de direction en bois massif verni, plateau 160 x 80 cm avec caisson latéral.",
    spec: ["Bois massif local", "Finition vernis mat", "Caisson 3 tiroirs"],
  },
  {
    id: "WM-08-11",
    name: "Panneaux contreplaqué industriel",
    filiale: "Wood Manufacture",
    category: "wood",
    price: 3400,
    unit: "panneau (1220x2440mm)",
    lead: "5 jours",
    desc: "Panneaux de contreplaqué qualité industrielle pour agencement, coffrage et menuiserie.",
    spec: ["Épaisseur : 12 à 22 mm", "Collage résistant à l'humidité", "Vente au panneau ou à la palette"],
  },
  {
    id: "ZI-02-04",
    name: "Location de lot en zone industrielle",
    filiale: "DIVINDUS ZI",
    category: "zi",
    price: null,
    unit: "sur devis",
    lead: "étude sous 15 jours",
    desc: "Mise à disposition de terrains et locaux viabilisés au sein des zones industrielles gérées par DIVINDUS ZI.",
    spec: ["Zones disponibles : Reghaïa, Sétif, Constantine, Sidi Bel Abbès", "Voirie, eau, électricité", "Accompagnement administratif"],
  },
];

export const SLIDES = [
  {
    tag: "DIVINDUS Capref",
    title: "Cabines et chalets préfabriqués, livrés en quelques semaines",
    desc: "Des solutions modulaires pour vos chantiers, bases-vie et bureaux temporaires, partout en Algérie.",
  },
  {
    tag: "DIVINDUS MCM",
    title: "Mobilier et structures métalliques fabriqués localement",
    desc: "Armoires, rayonnages et charpentes industrielles conçues et posées par nos équipes.",
  },
  {
    tag: "Wood Manufacture",
    title: "Bois massif et panneaux industriels",
    desc: "Du mobilier de bureau aux panneaux de coffrage, une production entièrement algérienne.",
  },
  {
    tag: "DIVINDUS ZI",
    title: "Des zones industrielles prêtes à accueillir votre activité",
    desc: "Lots viabilisés dans plusieurs zones industrielles à travers le pays.",
  },
];

export const PARTNERS = [
  { name: "DIVINDUS Capref", desc: "Cabines & chalets préfabriqués" },
  { name: "DIVINDUS MCM", desc: "Mobilier & construction métallique" },
  { name: "Wood Manufacture", desc: "Bois & panneaux industriels" },
  { name: "DIVINDUS ZI", desc: "Gestion des zones industrielles" },
  { name: "+ 10 autres filiales", desc: "Réparties dans 43 wilayas" },
];

export const fmt = (n) => new Intl.NumberFormat("fr-DZ").format(n) + " DA";

export const LEGAL_CONTENT = {
  cgv: {
    title: "Conditions Générales de Vente",
    sections: [
      { h: "Objet", p: "Les présentes conditions régissent les commandes passées sur la plateforme DIVINDUS pour les produits et services proposés par les filiales du groupe (cabines et chalets préfabriqués, mobilier et construction métallique, bois et panneaux industriels, location de lots en zone industrielle)." },
      { h: "Commandes et devis", p: "Toute commande donne lieu à une facture proforma indicative. Les articles marqués « sur devis » font l'objet d'une confirmation de prix par un chargé d'affaires avant facturation définitive. Le client dispose d'un délai pour annuler ou modifier sa commande tant qu'elle n'a pas été expédiée." },
      { h: "Paiement", p: "Le paiement s'effectue par virement bancaire ou par carte CIB/Edahabia. Pour les commandes réglées par virement, la commande est traitée à réception de la preuve de paiement." },
      { h: "Livraison", p: "Les délais annoncés sont donnés à titre indicatif et courent à compter de la confirmation de commande. Le client sera contacté par téléphone préalablement à la livraison." },
      { h: "Réclamations", p: "Toute réclamation relative à une commande peut être adressée via la page Aide et contact de la plateforme." },
    ],
  },
  mentions: {
    title: "Mentions légales",
    sections: [
      { h: "Éditeur de la plateforme", p: "DIVINDUS — Groupe des Industries Locales, société par actions, Pavillon 12, Résidence la Butte des deux Bassins, Oued Roumane, Alger, Algérie." },
      { h: "Identification", p: "NIF : 000216001234567 · RC : 16/00-1234567 B 16 (numéros de démonstration à remplacer par les références officielles du groupe)." },
      { h: "Hébergement", p: "Informations d'hébergement à compléter lors du déploiement réel de la plateforme." },
      { h: "Propriété intellectuelle", p: "L'ensemble des contenus, marques et logos présents sur cette plateforme sont la propriété du groupe DIVINDUS ou de ses filiales, sauf mention contraire." },
    ],
  },
  confidentialite: {
    title: "Politique de confidentialité",
    sections: [
      { h: "Données collectées", p: "Lors de la création d'un compte ou d'une commande, la plateforme collecte : nom, prénom, adresse email, numéro de téléphone, adresse de livraison et, le cas échéant, informations de l'entreprise (raison sociale, NIF)." },
      { h: "Utilisation des données", p: "Ces informations sont utilisées exclusivement pour le traitement des commandes, la facturation, la livraison et le support client. Elles ne sont pas transmises à des tiers à des fins commerciales." },
      { h: "Conservation", p: "Les données sont conservées pendant la durée nécessaire au traitement des commandes et au respect des obligations légales et comptables." },
      { h: "Droits des utilisateurs", p: "Tout utilisateur peut demander l'accès, la rectification ou la suppression de ses données personnelles en contactant le service client via la page Aide et contact." },
    ],
  },
};

export const FAQ_ITEMS = [
  { q: "Comment suivre l'état de ma commande ?", a: "Rendez-vous dans « Mes commandes » depuis le menu en haut de la page. Chaque commande affiche son statut actuel (confirmée, arrivée) et vous recevez une notification à chaque étape." },
  { q: "Puis-je annuler ou modifier une commande ?", a: "Oui, tant que la commande n'est pas encore arrivée. Depuis « Mes commandes », utilisez les boutons Annuler ou Modifier sur la commande concernée." },
  { q: "Quels sont les modes de paiement acceptés ?", a: "Le virement bancaire et la carte CIB/Edahabia. Pour les articles « sur devis », le prix final est confirmé par un chargé d'affaires avant tout paiement." },
  { q: "Comment se passe la livraison ?", a: "Le livreur vous contacte par téléphone avant son arrivée. Une fois le colis remis, vous confirmez vous-même la réception dans l'application." },
  { q: "Que faire si je ne reçois pas de code de vérification ?", a: "Vérifiez vos courriers indésirables si vous avez choisi l'email, ou patientez quelques minutes si vous avez choisi le SMS, puis utilisez le lien « Renvoyer le code »." },
];

export const STATUS_STEPS = [
  { key: "confirmee", label: "Confirmée", note: "a été confirmée." },
  { key: "livree", label: "Arrivée — à confirmer", note: "est arrivée à l'adresse indiquée. Merci de confirmer la réception." },
];
