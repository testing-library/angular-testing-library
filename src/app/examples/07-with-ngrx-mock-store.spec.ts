import { render } from '@testing-library/angular';
import { provideMockStore } from '@ngrx/store/testing';

import { WithNgRxMockStoreComponent, selectItems } from './07-with-ngrx-mock-store';

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

  component.getByText('Four');
  component.getByText('Seven');
});
