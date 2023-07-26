import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { HarnessComponent } from './20-test-harness';

// eslint-disable-next-line jest/no-disabled-tests
test.skip('can be used with TestHarness', async () => {
  const view = await render(`<app-harness />`, {
    imports: [HarnessComponent],
  });
  const loader = TestbedHarnessEnvironment.documentRootLoader(view.fixture);

  const buttonHarness = await loader.getHarness(MatButtonHarness);
  const button = await buttonHarness.host();
  button.click();

  const snackbarHarness = await loader.getHarness(MatSnackBarHarness);
  expect(await snackbarHarness.getMessage()).toMatch(/Pizza Party!!!/i);
});

// eslint-disable-next-line jest/no-disabled-tests
test.skip('can be used in combination with TestHarness', async () => {
  const user = userEvent.setup();

  const view = await render(HarnessComponent);
  const loader = TestbedHarnessEnvironment.documentRootLoader(view.fixture);

  await user.click(screen.getByRole('button'));

  const snackbarHarness = await loader.getHarness(MatSnackBarHarness);
  expect(await snackbarHarness.getMessage()).toMatch(/Pizza Party!!!/i);

  expect(screen.getByText(/Pizza Party!!!/i)).toBeInTheDocument();
});
