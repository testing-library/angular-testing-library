import { provideZoneChangeDetection } from '@angular/core';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/angular';

import { CdkVirtualScrollOverviewExampleComponent } from './13-scrolling.component';

test('should scroll to load more items', async () => {
  await render(CdkVirtualScrollOverviewExampleComponent, {
    providers: [provideZoneChangeDetection()],
  });

  const item0 = await screen.findByText(/Item #0/i);
  expect(item0).toBeVisible();

  screen.getByTestId('scroll-viewport').scrollTop = 500;
  await waitForElementToBeRemoved(() => screen.queryByText(/Item #0/i));

  const item12 = await screen.findByText(/Item #12/i);
  expect(item12).toBeVisible();
});
