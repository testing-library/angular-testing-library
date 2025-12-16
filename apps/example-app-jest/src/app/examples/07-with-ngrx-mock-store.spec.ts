import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WithNgRxMockStoreComponent, selectItems } from './07-with-ngrx-mock-store';
import { provideZoneChangeDetection } from '@angular/core';

test('works with provideMockStore', async () => {
  const user = userEvent.setup();

  await render(WithNgRxMockStoreComponent, {
    providers: [
      provideMockStore({
        selectors: [
          {
            selector: selectItems,
            value: ['Four', 'Seven'],
          },
        ],
      }),
      provideZoneChangeDetection(),
    ],
  });

  const store = TestBed.inject(MockStore);
  store.dispatch = jest.fn();

  await user.click(screen.getByText(/seven/i));

  expect(store.dispatch).toHaveBeenCalledWith({ type: '[Item List] send', item: 'Seven' });
});
