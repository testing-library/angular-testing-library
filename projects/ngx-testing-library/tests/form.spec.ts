import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createComponent, fireEvent } from '../src/public_api';

@Component({
  selector: 'login-form',
  template: `
    <div>
      <form [formGroup]="loginForm" (ngSubmit)="handleSubmit()">
        <label for="username-input">Username</label>
        <input id="username-input" placeholder="Username..." name="username" formControlName="username"/>
        <label id="password-label">Password</label>
        <input
          placeholder="Password..."
          type="password"
          name="password"
          aria-labelledby="password-label"
          formControlName="password"
        />
        <button type="submit">Submit</button>
      </form>
    <div>`,
})
export class LoginFormComponent {
  @Output() handleLogin = new EventEmitter<{ username: string; password: string }>();

  loginForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  handleSubmit() {
    if (this.loginForm.valid) {
      this.handleLogin.emit(this.loginForm.value);
    }
  }
}

test('login form submits', async () => {
  const fakeUser = { username: 'jackiechan', password: 'hiya! 🥋' };
  const { getComponentInstance, container, getByLabelText, getByText } = await createComponent(
    `<login-form></login-form>`,
    {
      declarations: [LoginFormComponent],
      imports: [ReactiveFormsModule],
    },
  );

  const loginForm = getComponentInstance<LoginFormComponent>('login-form');
  loginForm.handleLogin.emit = jest.fn();

  const usernameNode = getByLabelText(/username/i) as HTMLInputElement;
  const passwordNode = getByLabelText(/password/i) as HTMLInputElement;
  const submitButtonNode = getByText(/submit/i);

  usernameNode.value = fakeUser.username;
  fireEvent.input(usernameNode);

  passwordNode.value = fakeUser.password;
  fireEvent.input(passwordNode);

  loginForm.handleSubmit();

  expect(loginForm.handleLogin.emit).toHaveBeenCalledTimes(1);
  expect(loginForm.handleLogin.emit).toHaveBeenCalledWith(fakeUser);
  expect(submitButtonNode.type).toBe('submit');
});
