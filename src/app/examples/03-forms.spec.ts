import { ReactiveFormsModule } from '@angular/forms';
import { render, screen, fireEvent } from '@testing-library/angular';

import { FormsComponent } from './03-forms';

test('is possible to fill in a form and verify error messages (with the help of jest-dom https://testing-library.com/docs/ecosystem-jest-dom)', async () => {
  const { type, selectOptions } = await render(FormsComponent, {
    imports: [ReactiveFormsModule],
  });

  const nameControl = screen.getByLabelText('Name');
  const scoreControl = screen.getByLabelText(/score/i);
  const colorControl = screen.getByLabelText('color', { exact: false });
  const errors = screen.getByRole('alert');

  expect(errors).toContainElement(screen.queryByText('name is required'));
  expect(errors).toContainElement(screen.queryByText('score must be greater than 1'));
  expect(errors).toContainElement(screen.queryByText('color is required'));

  expect(nameControl).toBeInvalid();
  type(nameControl, 'Tim');
  type(scoreControl, '12');
  fireEvent.blur(scoreControl);
  selectOptions(colorControl, 'Green');

  expect(screen.queryByText('name is required')).not.toBeInTheDocument();
  expect(screen.queryByText('score must be lesser than 10')).toBeInTheDocument();
  expect(screen.queryByText('color is required')).not.toBeInTheDocument();

  expect(scoreControl).toBeInvalid();
  type(scoreControl, 7);
  fireEvent.blur(scoreControl);
  expect(scoreControl).toBeValid();

  expect(errors).not.toBeInTheDocument();

  expect(nameControl).toHaveValue('Tim');
  expect(scoreControl).toHaveValue(7);
  expect(colorControl).toHaveValue('G');

  const form = screen.getByTestId('my-form');
  expect(form).toHaveFormValues({
    name: 'Tim',
    score: 7,
    color: 'G',
  });
});
