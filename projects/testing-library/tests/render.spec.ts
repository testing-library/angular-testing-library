import { Component, NgModule } from '@angular/core';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
import { render } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: `
    <input type="text" data-testid="input" />
    <button>button</button>
  `,
})
class FixtureComponent {}

test('creates queries and events', async () => {
  const component = await render(FixtureComponent);

  component.input(component.getByTestId('input'), { target: { value: 'a super awesome input' } });
  component.getByDisplayValue('a super awesome input');
  component.click(component.getByText('button'));
});

describe('removeAngularAttributes', () => {
  test('should remove angular attribute', async () => {
    await render(FixtureComponent, {
      removeAngularAttributes: true,
    });

    expect(document.querySelector('[ng-version]')).toBeNull();
    expect(document.querySelector('[id]')).toBeNull();
  });

  test('is disabled by default', async () => {
    await render(FixtureComponent, {
      removeAngularAttributes: false,
    });

    expect(document.querySelector('[ng-version]')).not.toBeNull();
    expect(document.querySelector('[id]')).not.toBeNull();
  });
});

@NgModule({
  declarations: [FixtureComponent],
})
export class FixtureModule {}
describe('excludeComponentDeclaration', () => {
  test('will throw if component is declared in an import', async () => {
    await render(FixtureComponent, {
      imports: [FixtureModule],
      excludeComponentDeclaration: true,
    });
  });
});

describe('animationModule', () => {
  test('adds NoopAnimationsModule by default', async () => {
    await render(FixtureComponent);
    const noopAnimationsModule = TestBed.inject(NoopAnimationsModule);
    expect(noopAnimationsModule).toBeDefined();
  });

  test('does not add NoopAnimationsModule if BrowserAnimationsModule is an import', async () => {
    await render(FixtureComponent, {
      imports: [BrowserAnimationsModule],
    });

    const browserAnimationsModule = TestBed.inject(BrowserAnimationsModule);
    expect(browserAnimationsModule).toBeDefined();

    expect(() => TestBed.inject(NoopAnimationsModule)).toThrow();
  });
});
