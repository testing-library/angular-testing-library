import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { render, screen, fireEvent } from '@testing-library/angular';

import { WithNgRxMockStoreComponent, selectItems } from './07-with-ngrx-mock-store';

test('works with provideMockStore', async () => {
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
    ],
  });

  const store = TestBed.inject(MockStore);
  store.dispatch = jest.fn();

  fireEvent.click(screen.getByText(/seven/i));

  expect(store.dispatch).toHaveBeenCalledWith({ type: '[Item List] send', item: 'Seven' });
});
