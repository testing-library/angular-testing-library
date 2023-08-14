import { Component, Directive, Input, OnInit } from '@angular/core';
import { render, screen } from '../../src/public_api';

test('the value set in the directive constructor is overriden by the input binding', async () => {
  await render(`<atl-fixture [input]="'set by test'"  />`, {
    imports: [FixtureComponent, InputOverrideViaConstructorDirective],
  });

  expect(screen.getByText('set by test')).toBeInTheDocument();
});

test('the value set in the directive onInit is used instead of the input binding', async () => {
  await render(`<atl-fixture [input]="'set by test'"  />`, {
    imports: [FixtureComponent, InputOverrideViaOnInitDirective],
  });

  expect(screen.getByText('set by directive ngOnInit')).toBeInTheDocument();
});

test('the value set in the directive constructor is used instead of the input value', async () => {
  await render(`<atl-fixture input='set by test' />`, {
    imports: [FixtureComponent, InputOverrideViaConstructorDirective],
  });

  expect(screen.getByText('set by directive constructor')).toBeInTheDocument();
});

test('the value set in the directive ngOnInit is used instead of the input value and the directive constructor', async () => {
  await render(`<atl-fixture input='set by test' />`, {
    imports: [FixtureComponent, InputOverrideViaConstructorDirective, InputOverrideViaOnInitDirective],
  });

  expect(screen.getByText('set by directive ngOnInit')).toBeInTheDocument();
});

@Component({
  standalone: true,
  selector: 'atl-fixture',
  template: `{{ input }}`,
})
class FixtureComponent {
  @Input() public input = 'default value';
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'atl-fixture',
  standalone: true,
})
class InputOverrideViaConstructorDirective {
  constructor(private fixture: FixtureComponent) {
    this.fixture.input = 'set by directive constructor';
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'atl-fixture',
  standalone: true,
})
class InputOverrideViaOnInitDirective implements OnInit {
  constructor(private fixture: FixtureComponent) {}

  ngOnInit(): void {
    this.fixture.input = 'set by directive ngOnInit';
  }
}
