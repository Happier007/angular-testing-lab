import { Component, inject, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface SignupRequest {
  email: string;
  password: string;
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-signup-form',
  styles: ``,
  templateUrl: './signup-form.html',
})
export class SignupForm {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly submitted = output<SignupRequest>();

  protected readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }
}
