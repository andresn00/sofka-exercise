import { normalizeString } from './string.utils';

describe('normalizeString', () => {
  it('should remove diacritics and lowercase by default', () => {
    const result = normalizeString('ÁéÍõÜ Çñ');

    expect(result).toBe('aeiou cn');
  });

  it('should remove diacritics without lowercasing when lowerCase is false', () => {
    const result = normalizeString('ÁéÍõÜ Çñ', false);

    expect(result).toBe('AeIoU Cn');
  });

  it('should handle strings without diacritics', () => {
    const result = normalizeString('SimpleText');

    expect(result).toBe('simpletext');
  });

  it('should handle empty string', () => {
    const result = normalizeString('');

    expect(result).toBe('');
  });

  it('should preserve numbers and symbols', () => {
    const result = normalizeString('Café 123!');

    expect(result).toBe('cafe 123!');
  });

  it('should work with already normalized strings', () => {
    const result = normalizeString('resume');

    expect(result).toBe('resume');
  });
});
