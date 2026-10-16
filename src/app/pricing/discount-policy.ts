import { Service } from '@angular/core';

@Service()
export class DiscountPolicy {
  getRate(_customerId: string): number {
    return 0;
  }
}
