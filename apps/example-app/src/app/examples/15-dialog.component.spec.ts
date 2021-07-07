import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { render, screen, waitForElementToBeRemoved, fireEvent } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { DialogComponent, DialogContentComponent, DialogContentComponentModule } from './15-dialog.component';

test('dialog closes', async () => {
  const closeFn = jest.fn();
  await render(DialogContentComponent, {
    imports: [MatDialogModule],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {
          close: closeFn,
        },
      },
    ],
  });

  const cancelButton = await screen.findByRole('button', { name: /cancel/i });
  userEvent.click(cancelButton);

  expect(closeFn).toHaveBeenCalledTimes(1);
});

test('closes the dialog via the backdrop', async () => {
  await render(DialogComponent, {
    imports: [MatDialogModule, DialogContentComponentModule],
  });

  const openDialogButton = await screen.findByRole('button', { name: /open dialog/i });
  userEvent.click(openDialogButton);

  await screen.findByRole('dialog');
  await screen.findByRole('heading', { name: /dialog title/i });

  // using fireEvent because of:
  // unable to click element as it has or inherits pointer-events set to "none"
  // eslint-disable-next-line testing-library/no-node-access
  fireEvent.click(document.querySelector('.cdk-overlay-backdrop'));

  await waitForElementToBeRemoved(() => screen.getByRole('dialog'));

  const dialogTitle = screen.queryByRole('heading', { name: /dialog title/i });
  expect(dialogTitle).not.toBeInTheDocument();
});

test('opens and closes the dialog with buttons', async () => {
  await render(DialogComponent, {
    imports: [MatDialogModule, DialogContentComponentModule],
  });

  const openDialogButton = await screen.findByRole('button', { name: /open dialog/i });
  userEvent.click(openDialogButton);

  await screen.findByRole('dialog');
  await screen.findByRole('heading', { name: /dialog title/i });

  const cancelButton = await screen.findByRole('button', { name: /cancel/i });
  userEvent.click(cancelButton);

  await waitForElementToBeRemoved(() => screen.getByRole('dialog'));

  const dialogTitle = screen.queryByRole('heading', { name: /dialog title/i });
  expect(dialogTitle).not.toBeInTheDocument();
});
