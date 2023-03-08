import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/angular';

@Component({
  selector: 'app-login',
  template: `<h1>Login</h1>

    <form [formGroup]="form" (submit)="onSubmit(form)">
      <input type="email" aria-label="email" formControlName="email" />
      <div *ngIf="email.invalid && (email.dirty || email.touched)">
        <div *ngIf="email.errors?.['required']">Email is required</div>
      </div>
      <input type="password" aria-label="password" formControlName="password" />
      <div *ngIf="password.invalid && (password.dirty || password.touched)">
        <div *ngIf="password.errors?.['required']">Password is required</div>
      </div>
      <button type="submit" aria-label="submit" [disabled]="form.invalid">Submit</button>
    </form> `,
})
class LoginComponent {
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
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

describe('LoginComponent', () => {
  const setup = async () => {
    return render(LoginComponent, {
      imports: [ReactiveFormsModule],
    });
  };

  it('should create a component with inputs and a button to submit', async () => {
    await setup();

    expect(screen.getByRole('textbox', { name: 'email' })).toBeInTheDocument();
    expect(screen.getByLabelText('password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
  });

  it('should show a message required to password and login and a button must be disabled', async () => {
    await setup();

    await userEvent.click(screen.getByRole('textbox', { name: 'email' }));
    await userEvent.click(screen.getByLabelText('password'));
    await userEvent.tab();
    await userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(screen.getAllByText(/required/i)).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
  });
});
