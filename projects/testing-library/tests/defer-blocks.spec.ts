import { Component } from '@angular/core';
import { DeferBlockBehavior, DeferBlockState } from '@angular/core/testing';
import { render, screen, fireEvent } from '../src/public_api';

test('renders a defer block in different states using the official API', async () => {
  const { fixture } = await render(FixtureComponent);

  const deferBlockFixture = (await fixture.getDeferBlocks())[0];

  await deferBlockFixture.render(DeferBlockState.Loading);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(screen.queryByText(/Defer block content/i)).not.toBeInTheDocument();

  await deferBlockFixture.render(DeferBlockState.Complete);
  expect(screen.getByText(/Defer block content/i)).toBeInTheDocument();
  expect(screen.queryByText(/load/i)).not.toBeInTheDocument();
});

test('renders a defer block in different states using ATL', async () => {
  const { renderDeferBlock } = await render(FixtureComponent);

  await renderDeferBlock(DeferBlockState.Loading);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(screen.queryByText(/Defer block content/i)).not.toBeInTheDocument();

  await renderDeferBlock(DeferBlockState.Complete, 0);
  expect(screen.getByText(/Defer block content/i)).toBeInTheDocument();
  expect(screen.queryByText(/load/i)).not.toBeInTheDocument();
});

test('renders a defer block in different states using DeferBlockBehavior.Playthrough', async () => {
  await render(FixtureComponent, {
    deferBlockBehavior: DeferBlockBehavior.Playthrough,
  });

  expect(await screen.findByText(/Defer block content/i)).toBeInTheDocument();
});

test('renders a defer block in different states using DeferBlockBehavior.Playthrough event', async () => {
  await render(FixtureComponentWithEventsComponent, {
    deferBlockBehavior: DeferBlockBehavior.Playthrough,
  });

  const button = screen.getByRole('button', { name: /click/i });
  fireEvent.click(button);

  expect(screen.getByText(/empty defer block/i)).toBeInTheDocument();
});

test('renders a defer block initially in the loading state', async () => {
  await render(FixtureComponent, {
    deferBlockStates: DeferBlockState.Loading,
  });

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(screen.queryByText(/Defer block content/i)).not.toBeInTheDocument();
});

test('renders a defer block initially in the complete state', async () => {
  await render(FixtureComponent, {
    deferBlockStates: DeferBlockState.Complete,
  });

  expect(screen.getByText(/Defer block content/i)).toBeInTheDocument();
  expect(screen.queryByText(/load/i)).not.toBeInTheDocument();
});

test('renders a defer block in an initial state using the array syntax', async () => {
  await render(FixtureComponent, {
    deferBlockStates: [{ deferBlockState: DeferBlockState.Complete, deferBlockIndex: 0 }],
  });

  expect(screen.getByText(/Defer block content/i)).toBeInTheDocument();
  expect(screen.queryByText(/load/i)).not.toBeInTheDocument();
});

@Component({
  template: `
    @defer {
    <p>Defer block content</p>
    } @loading {
    <p>Loading...</p>
    }
  `,
})
class FixtureComponent {}

@Component({
  template: `
    <button #trigger>Click</button>
    @defer(on interaction(trigger)) {
    <div>empty defer block</div>
    }
  `,
})
class FixtureComponentWithEventsComponent {}
