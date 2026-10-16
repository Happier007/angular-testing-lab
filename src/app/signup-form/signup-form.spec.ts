import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupForm } from './signup-form';

describe('SignupForm', () => {
  let fixture: ComponentFixture<SignupForm>;
  let host: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [SignupForm],
    });

    fixture = TestBed.createComponent(SignupForm);
    host = fixture.nativeElement as HTMLElement;

    await fixture.whenStable();
  });

  it('disables submission while the form is invalid', () => {
    const form = host.querySelector('form[aria-label="Create account"]');

    expect(form).not.toBeNull();

    const submitButton = form!.querySelector<HTMLButtonElement>('button[type="submit"]');

    expect(submitButton).not.toBeNull();
    expect(submitButton!.disabled).toBe(true);
  });

  it('enables submission when the form is valid', async () => {
    const inputEmail = host.querySelector<HTMLInputElement>('#signup-email');
    const inputPassword = host.querySelector<HTMLInputElement>('#signup-password');
    const submitButton = host.querySelector<HTMLButtonElement>('button[type="submit"]');

    expect(inputEmail).not.toBeNull();
    expect(inputPassword).not.toBeNull();
    expect(submitButton).not.toBeNull();

    inputEmail!.value = 'dev@example.com';
    inputEmail!.dispatchEvent(new Event('input', { bubbles: true }));

    inputPassword!.value = 'password1';
    inputPassword!.dispatchEvent(new Event('input', { bubbles: true }));

    await fixture.whenStable();

    expect(submitButton!.disabled).toBe(false);
  });

  it('emits the form value when the user submits valid data', async () => {
    const onSubmitted = vi.fn();
    fixture.componentInstance.submitted.subscribe(onSubmitted);

    const inputEmail = host.querySelector<HTMLInputElement>('#signup-email');
    const inputPassword = host.querySelector<HTMLInputElement>('#signup-password');
    const submitButton = host.querySelector<HTMLButtonElement>('button[type="submit"]');

    expect(inputEmail).not.toBeNull();
    expect(inputPassword).not.toBeNull();
    expect(submitButton).not.toBeNull();

    inputEmail!.value = 'dev@example.com';
    inputEmail!.dispatchEvent(new Event('input', { bubbles: true }));

    inputPassword!.value = 'password1';
    inputPassword!.dispatchEvent(new Event('input', { bubbles: true }));

    await fixture.whenStable();

    expect(submitButton!.disabled).toBe(false);

    submitButton!.click();

    await fixture.whenStable();

    expect(onSubmitted).toHaveBeenCalledWith({
      email: 'dev@example.com',
      password: 'password1',
    });

    expect(onSubmitted).toHaveBeenCalledOnce();
  });

  it('does not emit when the invalid form is submitted', async () => {
    const onSubmitted = vi.fn();
    fixture.componentInstance.submitted.subscribe(onSubmitted);

    const form = host.querySelector<HTMLFormElement>('form[aria-label="Create account"]');

    expect(form).not.toBeNull();

    form!.dispatchEvent(new Event('submit', {
      bubbles: true,
      cancelable: true
    }));

    await fixture.whenStable();

    expect(onSubmitted).not.toHaveBeenCalled();
  });
});
