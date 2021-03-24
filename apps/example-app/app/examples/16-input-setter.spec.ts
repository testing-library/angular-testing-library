import { render, screen } from '@testing-library/angular';
import { InputSetterComponet } from './16-input-setter';

test('should run logic in the input setter', async () => {
  await render(InputSetterComponet, { componentProperties: { value: 1 } });
  const valueControl = screen.getByTestId('value');

  expect(valueControl.textContent).toBe('Value is 1');
});
