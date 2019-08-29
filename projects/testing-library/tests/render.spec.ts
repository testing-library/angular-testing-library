import { Component, NgModule } from '@angular/core';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
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

test('should add NoopAnimationsModule by default', async () => {
  await render(FixtureComponent);
  const noopAnimationsModule = TestBed.get<NoopAnimationsModule>(NoopAnimationsModule);
  expect(noopAnimationsModule).toBeDefined();
});

test('should not add NoopAnimationsModule if BrowserAnimationsModule is an import', async () => {
  await render(FixtureComponent, {
    imports: [BrowserAnimationsModule],
  });

  const browserAnimationsModule = TestBed.get<BrowserAnimationsModule>(BrowserAnimationsModule);
  expect(browserAnimationsModule).toBeDefined();

  expect(() => TestBed.get<NoopAnimationsModule>(NoopAnimationsModule)).toThrow();
});
