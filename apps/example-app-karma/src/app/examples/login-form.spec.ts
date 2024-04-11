import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/angular';
import { NgIf } from '@angular/common';

it('should create a component with inputs and a button to submit', async () => {
  await render(LoginComponent);

  expect(screen.getByRole('textbox', { name: 'email' })).toBeInTheDocument();
  expect(screen.getByLabelText('password')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
});

it('should display invalid message and submit button must be disabled', async () => {
  const user = userEvent.setup();

  await render(LoginComponent);

  const email = screen.getByRole('textbox', { name: 'email' });
  const password = screen.getByLabelText('password');

  await user.type(email, 'foo');
  await user.type(password, 's');

  expect(screen.getAllByText(/is invalid/i).length).toBe(2);
  expect(screen.getAllByRole('alert').length).toBe(2);
  expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
});

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <h1>Login</h1>

    <form [formGroup]="form" (submit)="onSubmit(form)">
      <input type="email" aria-label="email" formControlName="email" />
      <div *ngIf="email.invalid && (email.dirty || email.touched)" role="alert">Email is invalid</div>
      <input type="password" aria-label="password" formControlName="password" />
      <div *ngIf="password.invalid && (password.dirty || password.touched)" role="alert">Password is invalid</div>
      <button type="submit" aria-label="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `,
})
class LoginComponent {
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(private fb: FormBuilder) {}
  
  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  onSubmit(_fg: FormGroup): void {
    // do nothing
  }
}
