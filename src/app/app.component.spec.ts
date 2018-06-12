import { AppComponent } from './app.component';
import { createComponent } from 'ngx-testing-library';

test(`matches snapshot`, async () => {
  const { container } = await createComponent('<app-root></app-root>', {
    declarations: [AppComponent],
  });
  expect(container).toMatchSnapshot();
});

test(`should have a title`, async () => {
  const { detectChanges, getByText } = await createComponent('<app-root></app-root>', {
    declarations: [AppComponent],
  });
  expect(getByText('Welcome to app!')).toBeDefined();
});

test(`should render title in a h1 tag`, async () => {
  const { container } = await createComponent('<app-root></app-root>', {
    declarations: [AppComponent],
  });
  expect(container.querySelector('h1').textContent).toContain('Welcome to app!');
});
