import { Component, InjectionToken, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { test, afterEach, beforeEach } from 'vitest';
import { render, configure, Config } from '../public_api';

const TEST_TOKEN = new InjectionToken<string>('TEST_TOKEN');

@NgModule({
  providers: [{ provide: TEST_TOKEN, useValue: 'test-value' }],
})
class TestModule {}

@Component({
  selector: 'atl-fixture',
  template: `<div>Test Component</div>`,
  standalone: false,
})
class TestComponent {}

let originalConfig: Config;
beforeEach(() => {
  // Grab the existing configuration so we can restore
  // it at the end of the test
  configure((existingConfig) => {
    originalConfig = existingConfig as Config;
    return {
      defaultImports: [TestModule],
    };
  });
});

afterEach(() => {
  configure(originalConfig);
});

test('adds default imports to the testbed', async () => {
  await render(TestComponent);

  const tokenValue = TestBed.inject(TEST_TOKEN);
  expect(tokenValue).toBe('test-value');
});
