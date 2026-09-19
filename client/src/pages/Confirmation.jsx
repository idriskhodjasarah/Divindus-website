import { Check, Printer } from "lucide-react";
import { styles, color } from "../styles/styles";
import { fmt } from "../data/data";
import logo from "../assets/logo.png";

export default function Confirmation({ order, orderRef, onNewOrder, onViewOrders }) {
  const ref = orderRef;
  const today = new Date();
  const validUntil = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const dateFmt = (d) => d.toLocaleDateString("fr-DZ", { day: "2-digit", month: "2-digit", year: "numeric" });

  const quoteItems = order.items.filter((i) => i.price === null);
  const firmItems = order.items.filter((i) => i.price !== null);
  const sousTotal = firmItems.reduce((s, i) => s + i.price * i.qty, 0);
  const tva = Math.round(sousTotal * 0.19);
  const totalTTC = sousTotal + tva;

  const paiementLabel = order.paiement === "carte" ? "Carte CIB / Edahabia" : "Virement bancaire";

  return (
    <main style={styles.confirmWrap}>
      <div className="no-print">
        <div style={styles.confirmIcon}><Check size={28} strokeWidth={2} /></div>
        <h2 style={styles.confirmTitle}>Commande enregistrée</h2>
        <p style={styles.confirmSub}>
          Référence <strong>{ref}</strong> — un chargé d'affaires DIVINDUS confirmera les délais et, le cas échéant, les articles sur devis, à l'adresse indiquée pour {order.entreprise || "votre entreprise"}.
        </p>
      </div>

      <div id="invoice-print" style={styles.invoiceCard}>
        <div style={styles.invoiceHead}>
          <div>
            <div style={styles.invoiceLogo}>
              <img src={logo} alt="DIVINDUS" style={{ height: 26 }} />
            </div>
            <p style={styles.invoiceMeta}>Groupe des Industries Locales</p>
            <p style={styles.invoiceMeta}>Pavillon 12, Résidence la Butte des deux Bassins, Oued Roumane, Alger</p>
            <p style={styles.invoiceMeta}>NIF : 000216001234567 &nbsp;·&nbsp; RC : 16/00-1234567 B 16</p>
          </div>
          <div style={styles.invoiceHeadRight}>
            <h2 style={styles.invoiceTitle}>Facture proforma</h2>
            <p style={styles.invoiceMeta}>N° {ref}</p>
            <p style={styles.invoiceMeta}>Émise le {dateFmt(today)}</p>
            <p style={styles.invoiceMeta}>Valable jusqu'au {dateFmt(validUntil)}</p>
          </div>
        </div>

        <div className="party-row" style={styles.invoiceParties}>
          <div>
            <div style={styles.invoicePartyLabel}>Client</div>
            <p style={styles.invoicePartyLine}><strong>{order.entreprise || "—"}</strong></p>
            {order.nif && <p style={styles.invoicePartyLine}>NIF : {order.nif}</p>}
            <p style={styles.invoicePartyLine}>{order.contact}</p>
            <p style={styles.invoicePartyLine}>{order.telephone}</p>
            <p style={styles.invoicePartyLine}>{order.adresse}, {order.wilaya}</p>
          </div>
          <div>
            <div style={styles.invoicePartyLabel}>Paiement</div>
            <p style={styles.invoicePartyLine}>{paiementLabel}</p>
            <p style={styles.invoicePartyLine}>Devise : DZD</p>
          </div>
        </div>

        <div className="invoice-scroll" style={{ overflowX: "auto" }}>
        <table style={styles.invoiceTable}>
          <thead>
            <tr>
              <th style={styles.invoiceTh}>Référence</th>
              <th style={styles.invoiceTh}>Désignation</th>
              <th style={styles.invoiceTh}>Filiale</th>
              <th style={{ ...styles.invoiceTh, textAlign: "center" }}>Qté</th>
              <th style={{ ...styles.invoiceTh, textAlign: "right" }}>P.U. HT</th>
              <th style={{ ...styles.invoiceTh, textAlign: "right" }}>Total HT</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.id}>
                <td style={styles.invoiceTd}>{i.id}</td>
                <td style={styles.invoiceTd}>{i.name}</td>
                <td style={styles.invoiceTd}>{i.filiale}</td>
                <td style={{ ...styles.invoiceTd, textAlign: "center" }}>{i.qty}</td>
                <td style={{ ...styles.invoiceTd, textAlign: "right" }}>{i.price ? fmt(i.price) : "Sur devis"}</td>
                <td style={{ ...styles.invoiceTd, textAlign: "right" }}>{i.price ? fmt(i.price * i.qty) : "Sur devis"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {quoteItems.length > 0 && (
          <p style={styles.invoiceNote}>
            Les articles « sur devis » ne sont pas inclus dans le total ci-dessous ; leur prix sera confirmé séparément par un chargé d'affaires DIVINDUS avant facturation définitive.
          </p>
        )}

        <div style={styles.invoiceTotals}>
          <div style={styles.invoiceTotalRow}><span>Sous-total HT</span><span>{fmt(sousTotal)}</span></div>
          <div style={styles.invoiceTotalRow}><span>TVA (19%)</span><span>{fmt(tva)}</span></div>
          <div style={styles.invoiceDivider} />
          <div style={styles.invoiceGrandTotal}><span>Total TTC</span><span>{fmt(totalTTC)}</span></div>
        </div>

        <p style={styles.invoiceLegal}>
          Facture proforma à titre indicatif, sans valeur comptable. Devis valable 30 jours à compter de la date d'émission. Une facture définitive sera transmise après confirmation de la commande.
        </p>
      </div>

      <div className="no-print" style={styles.invoiceActions}>
        <button style={styles.secondaryBtn} onClick={() => window.print()}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Printer size={16} /> Imprimer / enregistrer en PDF
          </span>
        </button>
        <button style={styles.primaryBtn} onClick={onNewOrder}>Retour au catalogue</button>
      </div>
      <button className="no-print" style={styles.linkBtn} onClick={onViewOrders}>
        Voir toutes mes commandes
      </button>
    </main>
  );
}
