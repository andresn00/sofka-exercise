export const normalizeString = (str: string, lowerCase = true) =>
  (lowerCase ? str.toLowerCase() : str).normalize('NFD').replace(/\p{Diacritic}/gu, '');
