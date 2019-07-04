import { Component, ElementRef, OnInit, NgModule } from '@angular/core';
import { render } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: ``,
})
class FixtureComponent {}

@NgModule({
  declarations: [FixtureComponent],
})
export class FixtureModule {}

test('should not throw if component is declared in an import', async () => {
  await render(FixtureComponent, {
    imports: [FixtureModule],
    excludeComponentDeclaration: true,
  });
});
