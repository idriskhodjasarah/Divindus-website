import { useState, useEffect } from "react";
import { Layers, CreditCard, FileText } from "lucide-react";
import { styles } from "../styles/styles";
import { SLIDES, PARTNERS, PRODUCTS, fmt } from "../data/data";
import { apiFetch } from "../api";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { Feature, Stat } from "../components/FeatureAndStat";

export default function Landing({ onConnect, onOpenLegal, onOpenSupport }) {
  const [slide, setSlide] = useState(0);
  const [slides, setSlides] = useState(SLIDES);

  useEffect(() => {
    apiFetch("/content")
      .then(({ content }) => {
        if (content.hero_slides && content.hero_slides.length > 0) setSlides(content.hero_slides);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div>
      <PublicHeader onConnect={onConnect} />

      {/* Hero carousel */}
      <section style={styles.heroCarousel}>
        {slides.map((s, i) => (
          <div
            key={i}
            style={{
              ...styles.slide,
              opacity: i === slide ? 1 : 0,
              pointerEvents: i === slide ? "auto" : "none",
            }}
          >
            <div style={styles.slideInner}>
              <span style={styles.slideTag}>{s.tag}</span>
              <h1 style={styles.slideTitle}>{s.title}</h1>
              <p style={styles.slideDesc}>{s.desc}</p>
              <button style={styles.primaryBtn} onClick={onConnect}>
                Commander en ligne
              </button>
            </div>
          </div>
        ))}
        <div style={styles.slideDots}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                ...styles.dot,
                ...(i === slide ? styles.dotActive : {}),
              }}
              aria-label={"Diapositive " + (i + 1)}
            />
          ))}
        </div>
      </section>

      {/* What the platform offers */}
      <section style={styles.section}>
        <h2 style={styles.sectionHead}>Ce que propose la plateforme</h2>
        <div style={styles.featureGrid}>
          <Feature
            icon={<Layers size={20} />}
            title="Catalogue complet"
            desc="Tous les produits de nos filiales — cabines, mobilier, bois, zones industrielles — réunis au même endroit."
          />
          <Feature
            icon={<CreditCard size={20} />}
            title="Commande et paiement en ligne"
            desc="Ajoutez au panier, payez par virement ou par carte CIB/Edahabia, sans vous déplacer en agence."
          />
          <Feature
            icon={<FileText size={20} />}
            title="Devis et suivi"
            desc="Demandez un devis pour les projets sur mesure et suivez l'état de votre commande à tout moment."
          />
        </div>
      </section>

      {/* Stats */}
      <section style={styles.statsBand}>
        <div style={styles.statsBandInner}>
          <Stat value="2015" label="création du groupe" />
          <Stat value="14" label="filiales" />
          <Stat value="147" label="unités de production" />
          <Stat value="43" label="wilayas couvertes" />
        </div>
      </section>

      {/* Partners / subsidiaries */}
      <section id="filiales" style={styles.section}>
        <h2 style={styles.sectionHead}>Les filiales avec lesquelles nous travaillons</h2>
        <div style={styles.partnerGrid}>
          {PARTNERS.map((p) => (
            <div key={p.name} style={styles.partnerCard}>
              <div style={styles.partnerName}>{p.name}</div>
              <div style={styles.partnerDesc}>{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products preview */}
      <section id="catalogue" style={styles.section}>
        <h2 style={styles.sectionHead}>Un aperçu de nos produits</h2>
        <div style={styles.previewGrid}>
          {PRODUCTS.slice(0, 3).map((p) => (
            <div key={p.id} style={styles.card}>
              <div style={styles.cardTop}>
                <span style={styles.cardCode}>{p.id}</span>
                <span style={styles.cardFiliale}>{p.filiale}</span>
              </div>
              <h3 style={styles.cardName}>{p.name}</h3>
              <p style={styles.cardDesc}>{p.desc}</p>
              <div style={styles.cardFooter}>
                <div style={styles.cardPrice}>
                  {p.price ? fmt(p.price) : "Sur devis"}
                </div>
                <button style={styles.addBtn} onClick={onConnect}>
                  Découvrir
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button style={styles.secondaryBtn} onClick={onConnect}>
            Voir le catalogue complet
          </button>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaBand}>
        <h2 style={styles.ctaTitle}>Créez votre compte pour commander</h2>
        <p style={styles.ctaSub}>
          L'inscription est gratuite et prend moins de deux minutes.
        </p>
        <button style={styles.primaryBtn} onClick={onConnect}>
          Se connecter / S'inscrire
        </button>
      </section>

      <Footer onOpenLegal={onOpenLegal} onOpenSupport={onOpenSupport} />
    </div>
  );
}