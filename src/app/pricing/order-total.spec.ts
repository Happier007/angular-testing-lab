import { TestBed } from '@angular/core/testing';
import { DiscountPolicy } from './discount-policy';
import { OrderTotal } from './order-total';

describe('OrderTotal', () => {
  it('calculates the total using the provided discount policy', () => {
    const policyStub = {
      getRate: vi.fn().mockReturnValue(0.25),
    };

    TestBed.configureTestingModule({
      providers: [
        OrderTotal,
        {
          provide: DiscountPolicy,
          useValue: policyStub,
        },
      ],
    });

    const service = TestBed.inject(OrderTotal);

    const result = service.calculate(200, 'user-7');

    expect(result).toBe(150);
    expect(policyStub.getRate).toHaveBeenCalledWith('user-7');
    expect(policyStub.getRate).toHaveBeenCalledOnce();
  });
});