import { CheckoutService, DiscountPolicy } from './checkout';

describe('CheckoutService', () => {
  it('calculates the total using the customer discount', () => {

    const getRate = vi.fn().mockReturnValue(0.2)
    const policy: DiscountPolicy = {
      getRate
    }

    const service = new CheckoutService(policy);

    const result = service.calculateTotal(100, 'user-42');

    expect(result).toBe(80);
    expect(getRate).toHaveBeenCalledWith('user-42');
    expect(getRate).toHaveBeenCalledOnce();
  });
});