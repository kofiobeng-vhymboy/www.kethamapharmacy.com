export function validPhone(value: string): boolean {
  if (!/^[+\d\s().-]+$/.test(value.trim())) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15 && !/^0+$/.test(digits);
}

export function contactError(name: string, phone: string): string | null {
  if (name.trim().length < 2) return 'Please enter your name (at least two characters).';
  if (!validPhone(phone)) return 'Please enter a valid phone number, such as +233 24 123 4567.';
  return null;
}
