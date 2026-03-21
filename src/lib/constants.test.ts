import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate, formatTime } from './constants';

describe('formatPrice', () => {
  it('converts 0 paise to ₹0', () => {
    expect(formatPrice(0)).toBe('₹0');
  });

  it('converts 20000 paise to ₹200', () => {
    expect(formatPrice(20000)).toBe('₹200');
  });

  it('converts 100 paise to ₹1', () => {
    expect(formatPrice(100)).toBe('₹1');
  });

  it('converts 15050 paise to ₹150.5', () => {
    expect(formatPrice(15050)).toBe('₹150.5');
  });

  it('formats large amounts with Indian locale grouping', () => {
    const result = formatPrice(10000000); // 1,00,000 INR
    expect(result).toContain('₹');
    expect(result).toContain('1,00,000');
  });
});

describe('formatDate', () => {
  it('formats a date string correctly', () => {
    const result = formatDate('2025-01-15');
    // en-IN short format: "Wed, 15 Jan 2025"
    expect(result).toContain('15');
    expect(result).toContain('Jan');
    expect(result).toContain('2025');
  });

  it('formats another date correctly', () => {
    const result = formatDate('2025-12-25');
    expect(result).toContain('25');
    expect(result).toContain('Dec');
    expect(result).toContain('2025');
  });
});

describe('formatTime', () => {
  it('formats morning time correctly', () => {
    expect(formatTime('09:30')).toBe('9:30 AM');
  });

  it('formats afternoon time correctly', () => {
    expect(formatTime('14:00')).toBe('2:00 PM');
  });

  it('formats midnight as 12:00 AM', () => {
    expect(formatTime('00:00')).toBe('12:00 AM');
  });

  it('formats noon as 12:00 PM', () => {
    expect(formatTime('12:00')).toBe('12:00 PM');
  });

  it('formats 11:59 PM correctly', () => {
    expect(formatTime('23:59')).toBe('11:59 PM');
  });

  it('pads single-digit minutes', () => {
    expect(formatTime('08:05')).toBe('8:05 AM');
  });
});
