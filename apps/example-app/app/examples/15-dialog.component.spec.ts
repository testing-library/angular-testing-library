import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/angular';

import { DialogComponent, DialogContentDialogComponent, DialogContentDialogModule } from './15-dialog.component';

test('dialog closes', async () => {
  const closeFn = jest.fn();
  const { fixture } = await render(DialogContentDialogComponent, {
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
  fireEvent.click(cancelButton);

  expect(closeFn).toHaveBeenCalledTimes(1);
});

test('opens and closes the dialog with buttons', async () => {
  await render(DialogComponent, {
    imports: [MatDialogModule, DialogContentDialogModule],
  });

  const openDialogButton = await screen.findByRole('button', { name: /open dialog/i });
  fireEvent.click(openDialogButton);

  await screen.findByRole('dialog');
  await screen.findByRole('heading', { name: /dialog title/i });

  const cancelButton = await screen.findByRole('button', { name: /cancel/i });
  fireEvent.click(cancelButton);

  await waitForElementToBeRemoved(() => screen.getByRole('dialog'));

  const dialogTitle = screen.queryByRole('heading', { name: /dialog title/i });
  expect(dialogTitle).not.toBeInTheDocument();
});

test('closes the dialog via the backdrop', async () => {
  await render(DialogComponent, {
    imports: [MatDialogModule, DialogContentDialogModule],
  });

  const openDialogButton = await screen.findByRole('button', { name: /open dialog/i });
  fireEvent.click(openDialogButton);

  await screen.findByRole('dialog');
  await screen.findByRole('heading', { name: /dialog title/i });

  fireEvent.click(document.querySelector('.cdk-overlay-backdrop'));

  await waitForElementToBeRemoved(() => screen.getByRole('dialog'));

  const dialogTitle = screen.queryByRole('heading', { name: /dialog title/i });
  expect(dialogTitle).not.toBeInTheDocument();
});
