import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { render, screen } from '@testing-library/angular';

import { WithNgRxMockStoreComponent, selectItems } from './07-with-ngrx-mock-store';

test('works with provideMockStore', async () => {
  const { click } = await render(WithNgRxMockStoreComponent, {
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

  screen.getByText('Four');
  click(screen.getByText('Seven'));

  expect(store.dispatch).toBeCalledWith({ type: '[Item List] send', item: 'Seven' });
});
