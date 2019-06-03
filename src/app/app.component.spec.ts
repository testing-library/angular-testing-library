import { AppComponent } from './app.component';
import { render } from '@testing-library/angular';
import { configureJestSetup } from '@testing-library/angular/jest-utils';
import { provideMockStore } from '@ngrx/store/testing';

configureJestSetup();

test(`matches snapshot`, async () => {
  const { container } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
    providers: [provideMockStore()],
  });
  expect(container).toMatchSnapshot();
});

test(`should have a title`, async () => {
  const { getByText } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
    providers: [provideMockStore()],
  });
  expect(getByText('Welcome to app!')).toBeDefined();
});

test(`should render title in a h1 tag`, async () => {
  const { container } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
    providers: [provideMockStore()],
  });
  expect(container.querySelector('h1').textContent).toContain('Welcome to app!');
});
