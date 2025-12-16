import { provideZoneChangeDetection } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { InputGetterSetter } from './16-input-getter-setter';

test('should run logic in the input setter and getter', async () => {
  await render(InputGetterSetter, {
    componentProperties: { value: 'Angular' },
    providers: [provideZoneChangeDetection()],
  });
  const valueControl = screen.getByTestId('value');
  const getterValueControl = screen.getByTestId('value-getter');

  expect(valueControl).toHaveTextContent('I am value from setter Angular');
  expect(getterValueControl).toHaveTextContent('I am value from getter Angular');
});

test('should run logic in the input setter and getter while re-rendering', async () => {
  const { rerender } = await render(InputGetterSetter, {
    componentProperties: { value: 'Angular' },
    providers: [provideZoneChangeDetection()],
  });

  expect(screen.getByTestId('value')).toHaveTextContent('I am value from setter Angular');
  expect(screen.getByTestId('value-getter')).toHaveTextContent('I am value from getter Angular');

  await rerender({ componentProperties: { value: 'React' } });

  // note we have to re-query because the elements are not the same anymore
  expect(screen.getByTestId('value')).toHaveTextContent('I am value from setter React');
  expect(screen.getByTestId('value-getter')).toHaveTextContent('I am value from getter React');
});
