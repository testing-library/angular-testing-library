import { Component, Input } from '@angular/core';
import { createComponent, fireEvent } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: `<p>rawr</p>  `,
})
class FixtureComponent {}

describe('template syntax', () => {
  test('gets the component instance with a selector', async () => {
    const { getComponentInstance } = await createComponent('<fixture></fixture>', {
      declarations: [FixtureComponent],
    });

    expect(getComponentInstance<FixtureComponent>('fixture')).toBeDefined();
  });

  test('throws an error when no selector is passed', async () => {
    const { getComponentInstance } = await createComponent('<fixture></fixture>', {
      declarations: [FixtureComponent],
    });

    expect(() => getComponentInstance()).toThrowErrorMatchingSnapshot();
  });
});

describe('component type syntax', () => {
  test('gets the component instance', async () => {
    const { getComponentInstance } = await createComponent(
      { component: FixtureComponent },
      {
        declarations: [FixtureComponent],
      },
    );

    expect(getComponentInstance()).toBeDefined();
  });
});
