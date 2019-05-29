import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { render } from '../../src/public_api';
import { Component, Output, EventEmitter } from '@angular/core';
import { LoginFormComponent } from './form.component';

test('login form submits using the component syntax', async () => {
  const fakeUser = { username: 'jackiechan', password: 'hiya! 🥋' };
  const handleLogin = {
    emit: jest.fn(),
  };

  const { container, getByLabelText, getByText, input, submit } = await render(LoginFormComponent, {
    imports: [ReactiveFormsModule],
    componentProperties: {
      handleLogin: handleLogin as any,
    },
  });

  const usernameNode = getByLabelText(/username/i) as HTMLInputElement;
  const passwordNode = getByLabelText(/password/i) as HTMLInputElement;
  const submitButtonNode = getByText(/submit/i) as HTMLButtonElement;
  const formNode = container.querySelector('form');

  input(usernameNode, {
    target: {
      value: fakeUser.username,
    },
  });

  passwordNode.value = fakeUser.password;
  input(passwordNode);

  submit(formNode);

  expect(handleLogin.emit).toHaveBeenCalledTimes(1);
  expect(handleLogin.emit).toHaveBeenCalledWith(fakeUser);
  expect(submitButtonNode.type).toBe('submit');
});
