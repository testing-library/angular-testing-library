import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { MaterialFormsComponent } from './04-forms-with-material';

test('is possible to fill in a form and verify error messages (with the help of jest-dom https://testing-library.com/docs/ecosystem-jest-dom)', async () => {
  const user = userEvent.setup();

  const { fixture } = await render(MaterialFormsComponent);

  const nameControl = screen.getByLabelText(/name/i);
  const scoreControl = screen.getByRole('spinbutton', { name: /score/i });
  const colorControl = screen.getByPlaceholderText(/color/i);
  const dateControl = screen.getByRole('textbox', { name: /Choose a date/i });
  const checkboxControl = screen.getByRole('checkbox', { name: /agree/i });

  const errors = screen.getByRole('alert');

  expect(errors).toContainElement(screen.queryByText('name is required'));
  expect(errors).toContainElement(screen.queryByText('score must be greater than 1'));
  expect(errors).toContainElement(screen.queryByText('color is required'));
  expect(errors).toContainElement(screen.queryByText('agree is required'));

  await user.type(nameControl, 'Tim');
  await user.clear(scoreControl);
  await user.type(scoreControl, '12');
  await user.click(colorControl);
  await user.click(screen.getByText(/green/i));

  expect(checkboxControl).not.toBeChecked();
  await user.click(checkboxControl);
  expect(checkboxControl).toBeChecked();
  expect(checkboxControl).toBeValid();

  expect(screen.queryByText('name is required')).not.toBeInTheDocument();
  expect(screen.getByText('score must be lesser than 10')).toBeInTheDocument();
  expect(screen.queryByText('color is required')).not.toBeInTheDocument();
  expect(screen.queryByText('agree is required')).not.toBeInTheDocument();

  expect(scoreControl).toBeInvalid();
  await user.clear(scoreControl);
  await user.type(scoreControl, '7');
  expect(scoreControl).toBeValid();

  await user.type(dateControl, '08/11/2022');

  expect(errors).not.toBeInTheDocument();

  expect(nameControl).toHaveValue('Tim');
  expect(scoreControl).toHaveValue(7);
  expect(colorControl).toHaveTextContent('Green');
  expect(checkboxControl).toBeChecked();

  const form = screen.getByRole('form');
  expect(form).toHaveFormValues({
    name: 'Tim',
    score: 7,
  });

  // material doesn't add these to the form
  expect((fixture.componentInstance as MaterialFormsComponent).form?.get('agree')?.value).toBe(true);
  expect((fixture.componentInstance as MaterialFormsComponent).form?.get('color')?.value).toBe('G');
  expect((fixture.componentInstance as MaterialFormsComponent).form?.get('date')?.value).toEqual(new Date(2022, 7, 11));
});

test('set and show pre-set form values', async () => {
  const user = userEvent.setup();

  const { fixture, detectChanges } = await render(MaterialFormsComponent);

  fixture.componentInstance.form.setValue({
    name: 'Max',
    score: 4,
    color: 'B',
    date: new Date(2022, 7, 11),
    agree: true,
  });
  detectChanges();

  const nameControl = screen.getByLabelText(/name/i);
  const scoreControl = screen.getByRole('spinbutton', { name: /score/i });
  const colorControl = screen.getByPlaceholderText(/color/i);
  const checkboxControl = screen.getByRole('checkbox', { name: /agree/i });

  expect(nameControl).toHaveValue('Max');
  expect(scoreControl).toHaveValue(4);
  expect(colorControl).toHaveTextContent('Blue');
  expect(checkboxControl).toBeChecked();
  await user.click(checkboxControl);

  const form = screen.getByRole('form');
  expect(form).toHaveFormValues({
    name: 'Max',
    score: 4,
  });

  // material doesn't add these to the form
  expect((fixture.componentInstance as MaterialFormsComponent).form?.get('agree')?.value).toBe(false);
  expect((fixture.componentInstance as MaterialFormsComponent).form?.get('color')?.value).toBe('B');
  expect((fixture.componentInstance as MaterialFormsComponent).form?.get('date')?.value).toEqual(new Date(2022, 7, 11));
});
