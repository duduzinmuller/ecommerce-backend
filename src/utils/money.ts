export const toCents = (decimalAsString: string): number => {
  const normalized = decimalAsString.replace(/,/g, ".");
  return Math.round(parseFloat(normalized) * 100);
};

export const fromCents = (cents: number): string => {
  return (cents / 100).toFixed(2);
};

export const addDecimalStrings = (a: string, b: string): string => {
  const ai = toCents(a);
  const bi = toCents(b);
  return fromCents(ai + bi);
};

export const multiplyDecimalByInt = (a: string, qty: number): string => {
  const ai = toCents(a);
  return fromCents(ai * qty);
};
