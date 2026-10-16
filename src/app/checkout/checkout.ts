export interface DiscountPolicy {
  getRate(customerId: string): number;
}

export class CheckoutService {
  constructor(private readonly policy: DiscountPolicy) {}

  calculateTotal(price: number, customerId: string): number {
    const rate = this.policy.getRate(customerId);

    return price * (1 - rate);
  }
}
