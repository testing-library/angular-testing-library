import { Component } from '@angular/core';
import { render } from '../../src/public_api';

test('issue 364 detectChangesOnRender', async () => {
  @Component({
    selector: 'atl-fixture',
    template: `{{ myObj.myProp }}`,
  })
  class MyComponent {
    myObj: any = null;
  }

  // autoDetectChanges invokes change detection, which makes the test fail
  await render(MyComponent, {
    detectChangesOnRender: false,
  });
});
