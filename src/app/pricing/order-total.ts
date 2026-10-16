import { inject, Service } from '@angular/core';
import { DiscountPolicy } from './discount-policy';

@Service()
export class OrderTotal {
  private readonly discountPolicy = inject(DiscountPolicy);

  calculate(price: number, customerId: string): number {
    const rate = this.discountPolicy.getRate(customerId);

    return price * (1 - rate);
  }
}
