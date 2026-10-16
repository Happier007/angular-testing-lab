import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscountBanner } from './discount-banner';

describe('DiscountBanner', () => {
  let fixture: ComponentFixture<DiscountBanner>;
  let host: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [DiscountBanner],
    });

    fixture = TestBed.createComponent(DiscountBanner);
    host = fixture.nativeElement as HTMLElement;

    await fixture.whenStable();
  });

  it('renders the supplied discount', async () => {
    fixture.componentRef.setInput('discount', 25);
    await fixture.whenStable();

    const discountOffer = host.querySelector('section[aria-label="Discount offer"]');

    expect(discountOffer).not.toBeNull();
    expect(discountOffer!.textContent).toContain('Save 25%');
  });

  it('emits dismissed when the user clicks the dismiss button', () => {
    const onDismiss = vi.fn();
    fixture.componentInstance.dismissed.subscribe(onDismiss);

    const button = host.querySelector<HTMLButtonElement>(
      'button[aria-label="Dismiss discount offer"]',
    );

    expect(button).not.toBeNull();
    button!.click();

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('removes the banner after the user dismisses it', async () => {
    const button = host.querySelector<HTMLButtonElement>(
      'button[aria-label="Dismiss discount offer"]',
    );

    expect(button).not.toBeNull();
    button!.click();

    await fixture.whenStable();

    expect(host.querySelector<HTMLElement>('[aria-label="Discount offer"]')).toBeNull();
  });
});
