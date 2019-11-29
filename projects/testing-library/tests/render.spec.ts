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
    const noopAnimationsModule = TestBed.get<NoopAnimationsModule>(NoopAnimationsModule);
    expect(noopAnimationsModule).toBeDefined();
  });

  test('does not add NoopAnimationsModule if BrowserAnimationsModule is an import', async () => {
    await render(FixtureComponent, {
      imports: [BrowserAnimationsModule],
    });

    const browserAnimationsModule = TestBed.get<BrowserAnimationsModule>(BrowserAnimationsModule);
    expect(browserAnimationsModule).toBeDefined();

    expect(() => TestBed.get<NoopAnimationsModule>(NoopAnimationsModule)).toThrow();
  });
});
