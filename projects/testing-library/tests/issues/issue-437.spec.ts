import userEvent from '@testing-library/user-event';
import { screen, render } from '../../src/public_api';
import { MatSidenavModule } from '@angular/material/sidenav';

afterEach(() => {
  jest.useRealTimers();
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
  jest.useFakeTimers();
  const user = userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
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
});
