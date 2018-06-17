import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './form.component';
import { createComponent, fireEvent } from '../../src/public_api';

test('login form submits', async () => {
  const fakeUser = { username: 'jackiechan', password: 'hiya! 🥋' };
  const { getComponentInstance, getByLabelText, getByText } = await createComponent(`<login-form></login-form>`, {
    declarations: [LoginFormComponent],
    imports: [ReactiveFormsModule],
  });

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
