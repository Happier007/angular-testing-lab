export function calculateDiscount(price: number, premium: boolean): number {
  return premium ? price * 0.9 : price;
}
