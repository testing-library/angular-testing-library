import { ReactiveFormsModule } from '@angular/forms';
import { render } from '@testing-library/angular';

import { MaterialModule } from '../material.module';
import { MaterialFormsComponent } from './04-forms-with-material';

test('is possible to fill in a form and verify error messages (with the help of jest-dom https://testing-library.com/docs/ecosystem-jest-dom)', async () => {
  const component = await render(MaterialFormsComponent, {
    imports: [ReactiveFormsModule, MaterialModule],
  });

  const nameControl = component.getByPlaceholderText('Name');
  const scoreControl = component.getByPlaceholderText(/score/i);
  const colorControl = component.getByPlaceholderText('color', { exact: false });
  const errors = component.getByRole('alert');

  expect(errors).toContainElement(component.queryByText('name is required'));
  expect(errors).toContainElement(component.queryByText('score must be greater than 1'));
  expect(errors).toContainElement(component.queryByText('color is required'));

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

  const form = component.getByTestId('my-form');
  expect(form).toHaveFormValues({
    name: 'Tim',
    score: 7,
  });

  // not added to the form?
  expect((component.fixture.componentInstance as MaterialFormsComponent).form.get('color').value).toBe('G');
});
