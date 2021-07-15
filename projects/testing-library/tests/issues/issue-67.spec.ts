// https://github.com/testing-library/angular-testing-library/issues/67
import { Component } from '@angular/core';
import { render, screen } from '../../src/public_api';

@Component({
  template: `
    <div>
      <!-- if remove for="name" no error happens -->
      <label for="name">
        <input type="checkbox" id="name" data-testid="checkbox" />
        TEST
      </label>
    </div>
  `,
})
class BugGetByLabelTextComponent {}

test('first step to reproduce the bug: skip this test to avoid the error or remove the for attribute of label', async () => {
  expect(await render(BugGetByLabelTextComponent)).toBeDefined();
});

test('second step: bug happens :`(', async () => {
  await render(BugGetByLabelTextComponent);

  const checkboxByTestId = screen.getByTestId('checkbox');
  const checkboxByLabelTest = screen.getByLabelText('TEST');

  expect(checkboxByTestId).toBe(checkboxByLabelTest);
});
