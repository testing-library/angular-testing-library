import { render, screen, fireEvent } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { FormsComponent } from './03-forms';

test('is possible to fill in a form and verify error messages (with the help of jest-dom https://testing-library.com/docs/ecosystem-jest-dom)', async () => {
  await render(FormsComponent);

  const nameControl = screen.getByRole('textbox', { name: /name/i });
  const scoreControl = screen.getByRole('spinbutton', { name: /score/i });
  const colorControl = screen.getByRole('combobox', { name: /color/i });
  const errors = screen.getByRole('alert');

  expect(errors).toContainElement(screen.queryByText('name is required'));
  expect(errors).toContainElement(screen.queryByText('score must be greater than 1'));
  expect(errors).toContainElement(screen.queryByText('color is required'));

  expect(nameControl).toBeInvalid();
  userEvent.type(nameControl, 'Tim');
  userEvent.clear(scoreControl);
  userEvent.type(scoreControl, '12');
  fireEvent.blur(scoreControl);
  userEvent.selectOptions(colorControl, 'G');

  expect(screen.queryByText('name is required')).not.toBeInTheDocument();
  expect(screen.queryByText('score must be lesser than 10')).toBeInTheDocument();
  expect(screen.queryByText('color is required')).not.toBeInTheDocument();

  expect(scoreControl).toBeInvalid();
  userEvent.clear(scoreControl);
  userEvent.type(scoreControl, '7');
  fireEvent.blur(scoreControl);
  expect(scoreControl).toBeValid();

  expect(errors).not.toBeInTheDocument();

  expect(nameControl).toHaveValue('Tim');
  expect(scoreControl).toHaveValue(7);
  expect(colorControl).toHaveValue('G');

  const form = screen.getByRole('form');
  expect(form).toHaveFormValues({
    name: 'Tim',
    score: 7,
    color: 'G',
  });
});
