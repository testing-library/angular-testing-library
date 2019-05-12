import { AppComponent } from './app.component';
import { render } from '@angular-extensions/testing-library';
import { configureJestSetup } from '@angular-extensions/testing-library/jest-utils';

configureJestSetup();

test(`matches snapshot`, async () => {
  const { container } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
  });
  expect(container).toMatchSnapshot();
});

test(`should have a title`, async () => {
  const { getByText } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
  });
  expect(getByText('Welcome to app!')).toBeDefined();
});

test(`should render title in a h1 tag`, async () => {
  const { container } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
  });
  expect(container.querySelector('h1').textContent).toContain('Welcome to app!');
});
