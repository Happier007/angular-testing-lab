import { calculateDiscount } from './price';

describe('calculateDiscount', () => {
  it('applies a 10% discount for a premium user', () => {
    const result = calculateDiscount(100, true);

    expect(result).toBe(91);
  });

  it('returns the original price for a non-premium user', () => {
    const result = calculateDiscount(100, false);

    expect(result).toBe(100);
  });

  it('returns zero when the price is zero', () => {
    const result = calculateDiscount(0, true);

    expect(result).toBe(0);
  });
});
