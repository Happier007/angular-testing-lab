import { Component, input, output, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-discount-banner',
  styles: ``,
  templateUrl: './discount-banner.html',
})
export class DiscountBanner {
  readonly discount = input(0);
  readonly dismissed = output<void>();
  protected readonly visible = signal(true);

  dismiss(): void {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
