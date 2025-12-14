import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { vi, test, afterEach } from 'vitest';
import { render, screen } from '../public_api';

const ngOnChangesSpy = vi.fn();
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

afterEach(() => {
  ngOnChangesSpy.mockReset();
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
  expect(ngOnChangesSpy).toHaveBeenCalledTimes(1); // one time initially and one time for rerender
});

test('rerenders the component with updated inputs', async () => {
  const { rerender } = await render(FixtureComponent);
  expect(screen.getByText('Sarah')).toBeInTheDocument();

  const firstName = 'Mark';
  await rerender({ inputs: { firstName } });

  expect(screen.getByText(firstName)).toBeInTheDocument();
});

test('rerenders the component with updated inputs and resets other props', async () => {
  const firstName = 'Mark';
  const lastName = 'Peeters';
  const { rerender } = await render(FixtureComponent, {
    inputs: {
      firstName,
      lastName,
    },
  });

  expect(screen.getByText(`${firstName} ${lastName}`)).toBeInTheDocument();

  const firstName2 = 'Chris';
  await rerender({ inputs: { firstName: firstName2 } });

  expect(screen.getByText(firstName2)).toBeInTheDocument();
  expect(screen.queryByText(firstName)).not.toBeInTheDocument();
  expect(screen.queryByText(lastName)).not.toBeInTheDocument();

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

test('rerenders the component with updated inputs and keeps other props when partial is true', async () => {
  const firstName = 'Mark';
  const lastName = 'Peeters';
  const { rerender } = await render(FixtureComponent, {
    inputs: {
      firstName,
      lastName,
    },
  });

  expect(screen.getByText(`${firstName} ${lastName}`)).toBeInTheDocument();

  const firstName2 = 'Chris';
  await rerender({ inputs: { firstName: firstName2 }, partialUpdate: true });

  expect(screen.queryByText(firstName)).not.toBeInTheDocument();
  expect(screen.getByText(`${firstName2} ${lastName}`)).toBeInTheDocument();

  expect(ngOnChangesSpy).toHaveBeenCalledTimes(2); // one time initially and one time for rerender
  const rerenderedChanges = ngOnChangesSpy.mock.calls[1][0] as SimpleChanges;
  expect(rerenderedChanges).toEqual({
    firstName: {
      previousValue: 'Mark',
      currentValue: 'Chris',
      firstChange: false,
    },
  });
});

test('rerenders the component with updated props and resets other props with componentProperties', async () => {
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

  expect(screen.getByText(firstName2)).toBeInTheDocument();
  expect(screen.queryByText(firstName)).not.toBeInTheDocument();
  expect(screen.queryByText(lastName)).not.toBeInTheDocument();

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

test('rerenders the component with updated props keeps other props when partial is true', async () => {
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
  await rerender({ componentProperties: { firstName: firstName2 }, partialUpdate: true });

  expect(screen.queryByText(firstName)).not.toBeInTheDocument();
  expect(screen.getByText(`${firstName2} ${lastName}`)).toBeInTheDocument();

  expect(ngOnChangesSpy).toHaveBeenCalledTimes(2); // one time initially and one time for rerender
  const rerenderedChanges = ngOnChangesSpy.mock.calls[1][0] as SimpleChanges;
  expect(rerenderedChanges).toEqual({
    firstName: {
      previousValue: 'Mark',
      currentValue: 'Chris',
      firstChange: false,
    },
  });
});

test('change detection gets not called if `detectChangesOnRender` is set to false', async () => {
  const { rerender } = await render(FixtureComponent);
  expect(screen.getByText('Sarah')).toBeInTheDocument();

  const firstName = 'Mark';
  await rerender({ inputs: { firstName }, detectChangesOnRender: false });

  expect(screen.getByText('Sarah')).toBeInTheDocument();
  expect(screen.queryByText(firstName)).not.toBeInTheDocument();
});
