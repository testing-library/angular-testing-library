import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { render, screen } from '../src/public_api';

@Component({
  selector: 'atl-fixture',
  template: ` {{ firstName }} {{ lastName }} `,
})
class FixtureComponent {
  @Input() firstName = 'Sarah';
  @Input() lastName?: string;
}

test('rerenders the component with updated props', async () => {
  const { rerender } = await render(FixtureComponent);
  expect(screen.getByText('Sarah')).toBeInTheDocument();

  const firstName = 'Mark';
  await rerender({ componentProperties: { firstName } });

  expect(screen.getByText(firstName)).toBeInTheDocument();
});

test('rerenders without props', async () => {
  const { rerender } = await render(FixtureComponent);
  expect(screen.getByText('Sarah')).toBeInTheDocument();

  await rerender();

  expect(screen.getByText('Sarah')).toBeInTheDocument();
});

test('rerenders the component with updated inputs', async () => {
  const { rerender } = await render(FixtureComponent);
  expect(screen.getByText('Sarah')).toBeInTheDocument();

  const firstName = 'Mark';
  await rerender({ componentInputs: { firstName } });

  expect(screen.getByText(firstName)).toBeInTheDocument();
});

test('rerenders the component with updated props and resets other props', async () => {
  const firstName = 'Mark';
  const lastName = 'Peeters';
  const { rerender } = await render(FixtureComponent, {
    componentProperties: {
      firstName,
      lastName,
    },
  });

  expect(screen.getByText(`${firstName} ${lastName}`)).toBeInTheDocument();

  const firstName2 = 'Chris';
  await rerender({ componentProperties: { firstName: firstName2 } });

  expect(screen.getByText(`${firstName2} ${lastName}`)).toBeInTheDocument();
  expect(screen.queryByText(`${firstName} ${lastName}`)).not.toBeInTheDocument();
});

@Component({
  selector: 'atl-fixture-2',
  template: `{{
    hasImproved
      ? 'Great, I cannot remember any result as good as yours! Keep throwing!'
      : 'You can do better than that... Try again!'
  }}`,
})
class MotivatorComponent implements OnChanges {
  @Input() dice = 1;

  hasImproved = false;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes.dice);
    if (!changes.dice.firstChange && changes.dice) {
      this.hasImproved = changes.dice.currentValue > changes.dice.previousValue;
    }
  }
}

test('"ngOnChanges" gets called with an update', async () => {
  const { rerender } = await render(MotivatorComponent, {
    componentInputs: { dice: 1 },
  });

  expect(screen.getByText('You can do better than that... Try again!')).toBeInTheDocument();

  await rerender({
    componentInputs: {
      dice: 2,
    },
  });

  expect(screen.getByText('Great, I cannot remember any result as good as yours! Keep throwing!')).toBeInTheDocument();
});
