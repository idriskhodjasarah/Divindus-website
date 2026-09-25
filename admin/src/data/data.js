const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

export const PRODUCTS_SEED = [
  { id: "CAP-25-01", name: "Cabine préfabriquée CABINE 2025", filiale: "DIVINDUS Capref", price: 685000, unit: "unité", lead: "4 à 6 semaines", active: true,
    desc: "Cabine modulaire en panneaux sandwich isolés, montage rapide sur site, personnalisable en surface et ouvertures.",
    spec: ["Surface : 15 à 40 m²", "Ossature acier galvanisé", "Isolation thermique et phonique"] },
  { id: "CAP-25-02", name: "Chalet modulaire Sahel", filiale: "DIVINDUS Capref", price: 1240000, unit: "unité", lead: "6 à 8 semaines", active: true,
    desc: "Chalet à ossature bois et bardage extérieur, conçu pour les sites de vie de chantier et l'hébergement collectif.",
    spec: ["Surface : jusqu'à 60 m²", "Bardage bois ou composite", "Raccordement eau/électricité prévu"] },
  { id: "MCM-14-07", name: "Armoire métallique de bureau", filiale: "DIVINDUS MCM", price: 38500, unit: "unité", lead: "10 jours", active: true,
    desc: "Armoire de rangement en tôle d'acier, 2 portes battantes, 4 tablettes réglables.",
    spec: ["Dimensions : 180 x 90 x 40 cm", "Serrure à clé", "Peinture époxy"] },
  { id: "MCM-14-12", name: "Rayonnage industriel modulable", filiale: "DIVINDUS MCM", price: 22900, unit: "travée", lead: "10 jours", active: true,
    desc: "Rayonnage à charge lourde pour entrepôts et ateliers, montage sans boulonnage.",
    spec: ["Charge : 350 kg / niveau", "Hauteur : 200 à 300 cm", "5 niveaux réglables"] },
  { id: "MCM-14-19", name: "Charpente métallique industrielle", filiale: "DIVINDUS MCM", price: null, unit: "sur devis", lead: "selon projet", active: true,
    desc: "Étude et fabrication de charpentes pour halls industriels, entrepôts et hangars agricoles.",
    spec: ["Calcul de structure inclus", "Portées jusqu'à 30 m", "Pose par nos équipes"] },
  { id: "WM-08-03", name: "Bureau bois massif Direction", filiale: "Wood Manufacture", price: 96000, unit: "unité", lead: "3 semaines", active: true,
    desc: "Bureau de direction en bois massif verni, plateau 160 x 80 cm avec caisson latéral.",
    spec: ["Bois massif local", "Finition vernis mat", "Caisson 3 tiroirs"] },
  { id: "WM-08-11", name: "Panneaux contreplaqué industriel", filiale: "Wood Manufacture", price: 3400, unit: "panneau", lead: "5 jours", active: true,
    desc: "Panneaux de contreplaqué qualité industrielle pour agencement, coffrage et menuiserie.",
    spec: ["Épaisseur : 12 à 22 mm", "Collage résistant à l'humidité", "Vente au panneau ou à la palette"] },
  { id: "ZI-02-04", name: "Location de lot en zone industrielle", filiale: "DIVINDUS ZI", price: null, unit: "sur devis", lead: "étude sous 15 jours", active: true,
    desc: "Mise à disposition de terrains et locaux viabilisés au sein des zones industrielles gérées par DIVINDUS ZI.",
    spec: ["Zones disponibles : Reghaïa, Sétif, Constantine, Sidi Bel Abbès", "Voirie, eau, électricité", "Accompagnement administratif"] },
];

export const ORDERS_SEED = [
  { id: 1, ref: "DVX-482913", client: "SARL Batir Plus", email: "contact@batirplus.dz", telephone: "0555 12 34 56", wilaya: "Alger", paiement: "virement", statusIndex: 1, received: false, cancelled: false, refundStatus: null, placedAt: daysAgo(0.3), items: [{ name: "Cabine préfabriquée CABINE 2025", filiale: "DIVINDUS Capref", qty: 1, price: 685000 }] },
  { id: 2, ref: "DVX-317204", client: "EURL Ferronnerie Amine", email: "amine@ferronnerie.dz", telephone: "0661 22 33 44", wilaya: "Sétif", paiement: "carte", statusIndex: 1, received: true, cancelled: false, refundStatus: null, placedAt: daysAgo(3), items: [{ name: "Rayonnage industriel modulable", filiale: "DIVINDUS MCM", qty: 4, price: 22900 }] },
  { id: 3, ref: "DVX-655120", client: "Menuiserie El Wiam", email: "contact@elwiam.dz", telephone: "0770 55 66 77", wilaya: "Oran", paiement: "virement", statusIndex: 0, received: false, cancelled: false, refundStatus: null, placedAt: daysAgo(0.1), items: [{ name: "Panneaux contreplaqué industriel", filiale: "Wood Manufacture", qty: 12, price: 3400 }] },
  { id: 4, ref: "DVX-908331", client: "Groupe Bensalem Travaux", email: "info@bensalem.dz", telephone: "0540 88 99 00", wilaya: "Blida", paiement: "carte", statusIndex: 0, received: false, cancelled: true, refundStatus: "en_cours", placedAt: daysAgo(1), items: [{ name: "Armoire métallique de bureau", filiale: "DIVINDUS MCM", qty: 6, price: 38500 }] },
  { id: 5, ref: "DVX-221087", client: "SARL Batir Plus", email: "contact@batirplus.dz", telephone: "0555 12 34 56", wilaya: "Alger", paiement: "virement", statusIndex: 1, received: true, cancelled: false, refundStatus: null, placedAt: daysAgo(8), items: [{ name: "Bureau bois massif Direction", filiale: "Wood Manufacture", qty: 3, price: 96000 }] },
  { id: 6, ref: "DVX-773455", client: "Coopérative Agricole Sidi Bel Abbès", email: "coop@sba.dz", telephone: "0698 11 22 33", wilaya: "Sidi Bel Abbès", paiement: "carte", statusIndex: 1, received: false, cancelled: false, refundStatus: null, placedAt: daysAgo(0.5), items: [{ name: "Charpente métallique industrielle", filiale: "DIVINDUS MCM", qty: 1, price: 0 }] },
  { id: 7, ref: "DVX-114402", client: "ETB Kadri Construction", email: "kadri@construction.dz", telephone: "0662 44 55 66", wilaya: "Constantine", paiement: "virement", statusIndex: 0, received: false, cancelled: false, refundStatus: null, placedAt: daysAgo(2), items: [{ name: "Cabine préfabriquée CABINE 2025", filiale: "DIVINDUS Capref", qty: 2, price: 685000 }, { name: "Rayonnage industriel modulable", filiale: "DIVINDUS MCM", qty: 3, price: 22900 }] },
  { id: 8, ref: "DVX-990213", client: "Menuiserie El Wiam", email: "contact@elwiam.dz", telephone: "0770 55 66 77", wilaya: "Oran", paiement: "carte", statusIndex: 0, received: false, cancelled: true, refundStatus: "remboursee", placedAt: daysAgo(12), items: [{ name: "Panneaux contreplaqué industriel", filiale: "Wood Manufacture", qty: 8, price: 3400 }] },
  { id: 9, ref: "DVX-556781", client: "SARL Zone Industrielle Rouiba", email: "contact@zir.dz", telephone: "0559 77 88 99", wilaya: "Alger", paiement: "virement", statusIndex: 1, received: true, cancelled: false, refundStatus: null, placedAt: daysAgo(15), items: [{ name: "Location de lot en zone industrielle", filiale: "DIVINDUS ZI", qty: 1, price: 0 }] },
  { id: 10, ref: "DVX-338920", client: "Groupe Bensalem Travaux", email: "info@bensalem.dz", telephone: "0540 88 99 00", wilaya: "Blida", paiement: "virement", statusIndex: 1, received: false, cancelled: false, refundStatus: null, placedAt: daysAgo(0.05), items: [{ name: "Armoire métallique de bureau", filiale: "DIVINDUS MCM", qty: 10, price: 38500 }] },
];

export const MESSAGES_SEED = [
  { id: 1, nom: "Karim Belkacem", email: "karim.b@example.dz", sujet: "Retard sur ma commande DVX-317204", message: "Bonjour, ma commande devait arriver il y a 3 jours, pouvez-vous me donner des nouvelles ?", date: daysAgo(1), resolved: false },
  { id: 2, nom: "Nadia Cherif", email: "nadia.cherif@example.dz", sujet: "Question sur un devis", message: "Je souhaite un devis pour une charpente métallique de 25m de portée, quel est le délai habituel ?", date: daysAgo(2), resolved: false },
  { id: 3, nom: "Yacine Meziane", email: "y.meziane@example.dz", sujet: "Facture proforma introuvable", message: "Je n'arrive pas à retrouver la facture proforma de ma dernière commande, pouvez-vous me la renvoyer ?", date: daysAgo(4), resolved: true },
];

export const QUOTES_SEED = [
  { id: 1, client: "Coopérative Agricole Sidi Bel Abbès", email: "coop@sba.dz", telephone: "0698 11 22 33", produit: "Charpente métallique industrielle", details: "Hangar agricole de 25m x 40m, portée libre souhaitée, toiture double pente. Wilaya : Sidi Bel Abbès.", date: daysAgo(0.5), status: "nouveau", reponsePrix: null, reponseMessage: "" },
  { id: 2, client: "SARL Zone Industrielle Rouiba", email: "contact@zir.dz", telephone: "0559 77 88 99", produit: "Location de lot en zone industrielle", details: "Recherche un lot de 800 à 1200 m² pour activité de stockage, zone de Reghaïa de préférence.", date: daysAgo(2), status: "nouveau", reponsePrix: null, reponseMessage: "" },
  { id: 3, client: "ETB Kadri Construction", email: "kadri@construction.dz", telephone: "0662 44 55 66", produit: "Charpente métallique industrielle", details: "Extension d'un hall industriel existant, portée 18m, hauteur libre 6m.", date: daysAgo(6), status: "répondu", reponsePrix: 4200000, reponseMessage: "Devis établi sur la base des plans transmis : 4 200 000 DA HT, pose incluse, délai 5 semaines." },
];

export const HERO_SLIDES_SEED = [
  { tag: "DIVINDUS Capref", title: "Cabines et chalets préfabriqués, livrés en quelques semaines", desc: "Des solutions modulaires pour vos chantiers, bases-vie et bureaux temporaires, partout en Algérie." },
  { tag: "DIVINDUS MCM", title: "Mobilier et structures métalliques fabriqués localement", desc: "Armoires, rayonnages et charpentes industrielles conçues et posées par nos équipes." },
  { tag: "Wood Manufacture", title: "Bois massif et panneaux industriels", desc: "Du mobilier de bureau aux panneaux de coffrage, une production entièrement algérienne." },
  { tag: "DIVINDUS ZI", title: "Des zones industrielles prêtes à accueillir votre activité", desc: "Lots viabilisés dans plusieurs zones industrielles à travers le pays." },
];

export const FOOTER_CONTENT_SEED = {
  adresse: "Pavillon 12, Résidence la Butte des deux Bassins, Oued Roumane, Alger",
  telephone: "+213 (0)21 00 00 00",
  email: "contact@divindus.dz",
};

export const LEGAL_CONTENT_SEED = {
  cgv: { title: "Conditions Générales de Vente", body: "Les présentes conditions régissent les commandes passées sur la plateforme DIVINDUS...\n\nToute commande donne lieu à une facture proforma indicative. Les articles marqués « sur devis » font l'objet d'une confirmation de prix avant facturation définitive.\n\nLe paiement s'effectue par virement bancaire ou par carte CIB/Edahabia." },
  mentions: { title: "Mentions légales", body: "DIVINDUS — Groupe des Industries Locales, société par actions.\n\nNIF : 000216001234567 · RC : 16/00-1234567 B 16." },
  confidentialite: { title: "Politique de confidentialité", body: "Les données collectées lors de la création d'un compte ou d'une commande sont utilisées exclusivement pour le traitement des commandes, la facturation et le support client." },
};

export const ADMIN_PROFILE_SEED = { nom: "Amel Ferhat", email: "amel.ferhat@divindus.dz" };

export const REVENUE_TREND_30 = [
  310, 340, 290, 360, 400, 380, 420, 390, 430, 410, 450, 470, 440, 460, 480,
  420, 460, 380, 510, 590, 540, 610, 580, 650, 700, 690, 760, 810, 890, 860,
].map((v) => v * 1000);

export const fmt = (n) => new Intl.NumberFormat("fr-DZ").format(n) + " DA";
export const dateFmt = (d) => new Date(d).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" });

export function computeCustomers(orders) {
  const byClient = {};
  orders.forEach((o) => {
    if (!byClient[o.client]) byClient[o.client] = { name: o.client, email: o.email, telephone: o.telephone, orders: [] };
    byClient[o.client].orders.push(o);
  });
  return Object.values(byClient)
    .map((c) => ({
      ...c,
      count: c.orders.length,
      total: c.orders.filter((o) => !o.cancelled).reduce((s, o) => s + o.items.reduce((a, i) => a + i.price * i.qty, 0), 0),
    }))
    .sort((a, b) => b.total - a.total);
}

export function downloadCsv(filename, headers, rows) {
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
