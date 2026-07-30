import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

it('test click event with router.navigate', async () => {
  const user = userEvent.setup();
  await render(`<router-outlet></router-outlet>`, {
    routes: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'logged-in',
        component: LoggedInComponent,
      },
    ],
  });

  expect(await screen.findByRole('heading', { name: 'Login' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();

  const email = screen.getByRole('textbox', { name: 'email' });
  const password = screen.getByLabelText('password');

  await user.type(email, 'user@example.com');
  await user.type(password, 'with_valid_password');

  expect(screen.getByRole('button', { name: 'submit' })).toBeEnabled();

  await user.click(screen.getByRole('button', { name: 'submit' }));

  expect(await screen.findByRole('heading', { name: 'Logged In' })).toBeVisible();
});

@Component({
  template: `
    <h1>Login</h1>
    <button type="submit" (click)="onSubmit()">submit</button>
    <input type="email" aria-label="email" />
    <input type="password" aria-label="password" />
  `,
})
class LoginComponent {
  private readonly router = inject(Router);
  onSubmit(): void {
    this.router.navigate(['logged-in']);
  }
}

@Component({
  template: ` <h1>Logged In</h1> `,
})
class LoggedInComponent {}
