import { ReactiveFormsModule } from '@angular/forms';
import { createComponent, fireEvent } from '../../src/public_api';
import { LoginFormComponent } from './form.component';

test('login form submits using the component syntax', async () => {
  const fakeUser = { username: 'jackiechan', password: 'hiya! 🥋' };
  const handleLogin = {
    emit: jest.fn(),
  };

  const { container, getByLabelText, getByText } = await createComponent(
    {
      component: LoginFormComponent,
      parameters: {
        handleLogin: handleLogin as any,
      },
    },
    {
      declarations: [LoginFormComponent],
      imports: [ReactiveFormsModule],
    },
  );

  const usernameNode = getByLabelText(/username/i) as HTMLInputElement;
  const passwordNode = getByLabelText(/password/i) as HTMLInputElement;
  const submitButtonNode = getByText(/submit/i);
  const formNode = container.querySelector('form');

  usernameNode.value = fakeUser.username;
  fireEvent.input(usernameNode);

  passwordNode.value = fakeUser.password;
  fireEvent.input(passwordNode);

  fireEvent.submit(formNode);

  expect(handleLogin.emit).toHaveBeenCalledTimes(1);
  expect(handleLogin.emit).toHaveBeenCalledWith(fakeUser);
  expect(submitButtonNode.type).toBe('submit');
});
