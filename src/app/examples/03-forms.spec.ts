import { ReactiveFormsModule } from '@angular/forms';
import { render } from '@testing-library/angular';

import { FormsComponent } from './03-forms';

test('is possible to fill in a form and verify error messages (with the help of jest-dom https://testing-library.com/docs/ecosystem-jest-dom)', async () => {
  const component = await render(FormsComponent, {
    imports: [ReactiveFormsModule],
  });

  const nameControl = component.getByLabelText('Name');
  const scoreControl = component.getByLabelText(/score/i);
  const colorControl = component.getByLabelText('color', { exact: false });
  const errors = component.getByRole('alert');

  expect(errors).toContainElement(component.queryByText('name is required'));
  expect(errors).toContainElement(component.queryByText('score must be greater than 1'));
  expect(errors).toContainElement(component.queryByText('color is required'));

  expect(nameControl).toBeInvalid();
  component.type(nameControl, 'Tim');
  component.type(scoreControl, '12');
  component.selectOptions(colorControl, 'Green');

  expect(component.queryByText('name is required')).not.toBeInTheDocument();
  expect(component.queryByText('score must be lesser than 10')).toBeInTheDocument();
  expect(component.queryByText('color is required')).not.toBeInTheDocument();

  expect(scoreControl).toBeInvalid();
  component.type(scoreControl, '7');
  expect(scoreControl).toBeValid();

  expect(errors).not.toBeInTheDocument();

  expect(nameControl).toHaveValue('Tim');
  expect(scoreControl).toHaveValue(7);
  expect(colorControl).toHaveValue('G');

  const form = component.getByTestId('my-form');
  expect(form).toHaveFormValues({
    name: 'Tim',
    score: 7,
    color: 'G',
  });
});
