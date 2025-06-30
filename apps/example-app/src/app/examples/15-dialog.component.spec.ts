import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { DialogComponent, DialogContentComponent } from './15-dialog.component';

test('dialog closes', async () => {
  const user = userEvent.setup();

  const closeFn = jest.fn();
  await render(DialogContentComponent, {
    imports: [NoopAnimationsModule],
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
  await user.click(cancelButton);

  expect(closeFn).toHaveBeenCalledTimes(1);
});

test('closes the dialog via the backdrop', async () => {
  const user = userEvent.setup();

  await render(DialogComponent, {
    imports: [NoopAnimationsModule],
  });

  const openDialogButton = await screen.findByRole('button', { name: /open dialog/i });
  await user.click(openDialogButton);

  const dialogControl = await screen.findByRole('dialog');
  expect(dialogControl).toBeInTheDocument();
  const dialogTitleControl = await screen.findByRole('heading', { name: /dialog title/i });
  expect(dialogTitleControl).toBeInTheDocument();

  // eslint-disable-next-line testing-library/no-node-access
  await user.click(document.querySelector('.cdk-overlay-backdrop')!);

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  const dialogTitle = screen.queryByRole('heading', { name: /dialog title/i });
  expect(dialogTitle).not.toBeInTheDocument();
});

test('opens and closes the dialog with buttons', async () => {
  const user = userEvent.setup();

  await render(DialogComponent, {
    imports: [NoopAnimationsModule],
  });

  const openDialogButton = await screen.findByRole('button', { name: /open dialog/i });
  await user.click(openDialogButton);

  const dialogControl = await screen.findByRole('dialog');
  expect(dialogControl).toBeInTheDocument();
  const dialogTitleControl = await screen.findByRole('heading', { name: /dialog title/i });
  expect(dialogTitleControl).toBeInTheDocument();

  const cancelButton = await screen.findByRole('button', { name: /cancel/i });
  await user.click(cancelButton);

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  const dialogTitle = screen.queryByRole('heading', { name: /dialog title/i });
  expect(dialogTitle).not.toBeInTheDocument();
});
