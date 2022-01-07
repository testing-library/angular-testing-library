import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { MaterialModule } from '../material.module';
import { MaterialFormsComponent } from './04-forms-with-material';

test('is possible to fill in a form and verify error messages (with the help of jest-dom https://testing-library.com/docs/ecosystem-jest-dom)', async () => {
  const { fixture } = await render(MaterialFormsComponent, {
    imports: [MaterialModule],
  });

  const nameControl = screen.getByLabelText(/name/i);
  const scoreControl = screen.getByRole('spinbutton', { name: /score/i });
  const colorControl = screen.getByRole('combobox', { name: /color/i });
  const errors = screen.getByRole('alert');

  expect(errors).toContainElement(screen.queryByText('name is required'));
  expect(errors).toContainElement(screen.queryByText('score must be greater than 1'));
  expect(errors).toContainElement(screen.queryByText('color is required'));

  userEvent.type(nameControl, 'Tim');
  userEvent.clear(scoreControl);
  userEvent.type(scoreControl, '12');
  userEvent.click(colorControl);
  userEvent.click(screen.getByText(/green/i));

  expect(screen.queryByText('name is required')).not.toBeInTheDocument();
  expect(screen.getByText('score must be lesser than 10')).toBeInTheDocument();
  expect(screen.queryByText('color is required')).not.toBeInTheDocument();

  expect(scoreControl).toBeInvalid();
  userEvent.clear(scoreControl);
  userEvent.type(scoreControl, '7');
  expect(scoreControl).toBeValid();

  expect(errors).not.toBeInTheDocument();

  expect(nameControl).toHaveValue('Tim');
  expect(scoreControl).toHaveValue(7);
  expect(colorControl).toHaveTextContent('Green');

  const form = screen.getByRole('form');
  expect(form).toHaveFormValues({
    name: 'Tim',
    score: 7,
  });
  expect((fixture.componentInstance as MaterialFormsComponent).form?.get('color')?.value).toBe('G');
});

test('set and show pre-set form values', async () => {
  const { fixture, detectChanges } = await render(MaterialFormsComponent, {
    imports: [MaterialModule],
  });

  fixture.componentInstance.form.setValue({
    name: 'Max',
    score: 4,
    color: 'B',
  });
  detectChanges();

  const nameControl = screen.getByLabelText(/name/i);
  const scoreControl = screen.getByRole('spinbutton', { name: /score/i });
  const colorControl = screen.getByRole('combobox', { name: /color/i });

  expect(nameControl).toHaveValue('Max');
  expect(scoreControl).toHaveValue(4);
  expect(colorControl).toHaveTextContent('Blue');

  const form = screen.getByRole('form');
  expect(form).toHaveFormValues({
    name: 'Max',
    score: 4,
  });
  expect((fixture.componentInstance as MaterialFormsComponent).form?.get('color')?.value).toBe('B');
});
