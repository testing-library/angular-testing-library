import { Component } from '@angular/core';
import { render, screen } from '../../src/public_api';

test('stub', async () => {
  await render(FixtureComponent, {
    componentImports: [StubComponent],
  });

  expect(screen.getByText('Hello from stub')).toBeInTheDocument();
});

test('configure', async () => {
  await render(FixtureComponent, {
    configureTestBed: (testBed) => {
      testBed.overrideComponent(FixtureComponent, {
        add: {
          imports: [StubComponent],
        },
        remove: {
          imports: [ChildComponent],
        },
      });
    },
  });

  expect(screen.getByText('Hello from stub')).toBeInTheDocument();
});

test('child', async () => {
  await render(FixtureComponent);
  expect(screen.getByText('Hello from child')).toBeInTheDocument();
});

@Component({
  selector: 'atl-child',
  template: `Hello from child`,
  standalone: true,
})
class ChildComponent {}

@Component({
  selector: 'atl-child',
  template: `Hello from stub`,
  standalone: true,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property, @typescript-eslint/naming-convention
  host: { 'collision-id': StubComponent.name },
})
class StubComponent {}

@Component({
  selector: 'atl-fixture',
  template: `<atl-child />`,
  standalone: true,
  imports: [ChildComponent],
})
class FixtureComponent {}
