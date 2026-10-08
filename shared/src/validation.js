// Algerian phone numbers: starts with 0, 10 digits total (e.g. 0555 12 34 56).
export function isValidPhone(value) {
  const digits = (value || "").replace(/\s/g, "");
  return /^0\d{9}$/.test(digits);
}

// No external API here, just a basic sanity check: a real address generally
// has some length and includes at least one digit (a street/building number).
export function isValidAddress(value) {
  const v = (value || "").trim();
  return v.length >= 8 && /\d/.test(v);
}

export const PHONE_ERROR = "Le numéro doit commencer par 0 et contenir 10 chiffres (ex : 0555123456).";
export const ADDRESS_ERROR = "Merci d'indiquer une adresse complète, avec un numéro (ex : 12 Rue des Frères, Alger).";