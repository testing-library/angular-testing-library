import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { DeferBlockState } from '@angular/core/testing';
import { DeferableViewComponent } from './21-deferable-view.component';

test('renders deferred views based on state', async () => {
  const { renderDeferBlock } = await render(DeferableViewComponent);

  expect(screen.getByText(/Hello from placeholder/i)).toBeInTheDocument();

  await renderDeferBlock(DeferBlockState.Loading);
  expect(screen.getByText(/Hello from loading/i)).toBeInTheDocument();

  await renderDeferBlock(DeferBlockState.Complete);
  expect(screen.getByText(/Hello from deferred child component/i)).toBeInTheDocument();
});

test('initially renders deferred views based on given state', async () => {
  await render(DeferableViewComponent, {
    deferBlockStates: DeferBlockState.Error,
  });

  expect(screen.getByText(/Hello from error/i)).toBeInTheDocument();
});
