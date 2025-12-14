import userEvent from '@testing-library/user-event';
import { MatSidenavModule } from '@angular/material/sidenav';
import { vi, test, afterEach } from 'vitest';
import { screen, render } from '../../public_api';

afterEach(() => {
  vi.useRealTimers();
});

test('issue #437', async () => {
  const user = userEvent.setup();
  await render(
    `
      <ng-container>
        <mat-sidenav-container>
            <mat-sidenav [opened]="true" position="end" mode="over" role="complementary">
                <button data-testid="test-button">test</button>
            </mat-sidenav>
            <mat-sidenav-content>
              <div></div>
            </mat-sidenav-content>
        </mat-sidenav-container>
      </ng-container>
      `,
    { imports: [MatSidenavModule] },
  );

  await screen.findByTestId('test-button');

  await user.click(screen.getByTestId('test-button'));
});

test('issue #437 with fakeTimers', async () => {
  vi.useFakeTimers();
  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
  });
  await render(
    `
      <ng-container>
        <mat-sidenav-container>
            <mat-sidenav [opened]="true" position="end" mode="over" role="complementary">
                <button data-testid="test-button">test</button>
            </mat-sidenav>
            <mat-sidenav-content>
              <div></div>
            </mat-sidenav-content>
        </mat-sidenav-container>
      </ng-container>
      `,
    { imports: [MatSidenavModule] },
  );

  await screen.findByTestId('test-button');

  await user.click(screen.getByTestId('test-button'));
  vi.useRealTimers();
});
