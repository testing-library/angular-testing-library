import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { render, screen } from '../src/public_api';

let ngOnChangesSpy: jest.Mock;
@Component({
  selector: 'atl-fixture',
  template: ` {{ firstName }} {{ lastName }} `,
})
class FixtureComponent implements OnChanges {
  @Input() firstName = 'Sarah';
  @Input() lastName?: string;
  ngOnChanges(changes: SimpleChanges): void {
    ngOnChangesSpy(changes);
  }
}

beforeEach(() => {
  ngOnChangesSpy = jest.fn();
});

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

  expect(screen.getByText(`${firstName2}`)).toBeInTheDocument();
  expect(screen.queryByText(`${firstName2} ${lastName}`)).not.toBeInTheDocument();
  expect(screen.queryByText(`${firstName} ${lastName}`)).not.toBeInTheDocument();

  expect(ngOnChangesSpy).toHaveBeenCalledTimes(2); // one time initially and one time for rerender
  const rerenderedChanges = ngOnChangesSpy.mock.calls[1][0] as SimpleChanges;
  expect(rerenderedChanges).toEqual({
    lastName: {
      previousValue: 'Peeters',
      currentValue: undefined,
      firstChange: false,
    },
    firstName: {
      previousValue: 'Mark',
      currentValue: 'Chris',
      firstChange: false,
    },
  });
});
