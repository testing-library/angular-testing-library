import { render } from '@testing-library/angular';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { WithNgRxMockStoreComponent, selectItems } from './07-with-ngrx-mock-store';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

test('works with provideMockStore', async () => {
  const component = await render(WithNgRxMockStoreComponent, {
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

  const store = TestBed.get(Store) as MockStore<any>;
  store.dispatch = jest.fn();

  component.getByText('Four');
  component.click(component.getByText('Seven'));

  expect(store.dispatch).toBeCalledWith({ type: '[Item List] send', item: 'Seven' });
});
