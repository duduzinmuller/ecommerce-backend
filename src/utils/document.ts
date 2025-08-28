export function stripNonDigits(value: string): string {
  return value.replace(/\D+/g, "");
}

export function isAllRepeatedDigits(value: string): boolean {
  return /^(\d)\1+$/.test(value);
}

export function validateCPF(raw: string): boolean {
  const cpf = stripNonDigits(raw);
  if (cpf.length !== 11) return false;
  if (isAllRepeatedDigits(cpf)) return false;

  const calcDigit = (slice: number): number => {
    let sum = 0;
    for (let i = 0; i < slice; i++) {
      sum += parseInt(cpf[i]!, 10) * (slice + 1 - i);
    }
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const d1 = calcDigit(9);
  const d2 = calcDigit(10);
  return d1 === parseInt(cpf[9]!, 10) && d2 === parseInt(cpf[10]!, 10);
}

export function validateCNPJ(raw: string): boolean {
  const cnpj = stripNonDigits(raw);
  if (cnpj.length !== 14) return false;
  if (isAllRepeatedDigits(cnpj)) return false;

  const calcDigit = (length: number): number => {
    const weights =
      length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += parseInt(cnpj[i]!, 10) * weights[i]!;
    }
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const d1 = calcDigit(12);
  const d2 = calcDigit(13);
  return d1 === parseInt(cnpj[12]!, 10) && d2 === parseInt(cnpj[13]!, 10);
}

export function isValidBrazilianDocument(value: string): boolean {
  const digits = stripNonDigits(value);
  if (digits.length === 11) return validateCPF(digits);
  if (digits.length === 14) return validateCNPJ(digits);
  return false;
}
