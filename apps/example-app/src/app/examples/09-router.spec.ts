import { render, screen, waitForElementToBeRemoved } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { DetailComponent, RootComponent, HiddenDetailComponent } from './09-router';

test('it can navigate to routes', async () => {
  await render(RootComponent, {
    declarations: [DetailComponent, HiddenDetailComponent],
    routes: [
      {
        path: '',
        children: [
          {
            path: 'detail/:id',
            component: DetailComponent,
          },
          {
            path: 'hidden-detail',
            component: HiddenDetailComponent,
          },
        ],
      },
    ],
  });

  expect(screen.queryByText(/Detail one/i)).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('link', { name: /load one/i }));
  expect(await screen.findByRole('heading', { name: /Detail one/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('link', { name: /load three/i }));
  await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: /Detail one/i }));
  expect(await screen.findByRole('heading', { name: /Detail three/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('link', { name: /back to parent/i }));
  await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: /Detail three/i }));

  userEvent.click(screen.getByRole('link', { name: /load two/i }));
  expect(await screen.findByRole('heading', { name: /Detail two/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('link', { name: /hidden x/i }));
  expect(await screen.findByText(/You found the treasure!/i)).toBeInTheDocument();
});

test('it can navigate to routes - workaround', async () => {
  const { navigate } = await render(RootComponent, {
    declarations: [DetailComponent, HiddenDetailComponent],
    routes: [
      {
        path: '',
        children: [
          {
            path: 'detail/:id',
            component: DetailComponent,
          },
          {
            path: 'hidden-detail',
            component: HiddenDetailComponent,
          },
        ],
      },
    ],
  });

  expect(screen.queryByText(/Detail one/i)).not.toBeInTheDocument();

  await navigate(screen.getByRole('link', { name: /load one/i }));
  expect(screen.getByRole('heading', { name: /Detail one/i })).toBeInTheDocument();

  await navigate(screen.getByRole('link', { name: /load three/i }));
  expect(screen.queryByRole('heading', { name: /Detail one/i })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Detail three/i })).toBeInTheDocument();

  await navigate(screen.getByRole('link', { name: /back to parent/i }));
  expect(screen.queryByRole('heading', { name: /Detail three/i })).not.toBeInTheDocument();

  await navigate(screen.getByRole('link', { name: /load two/i }));
  expect(screen.getByRole('heading', { name: /Detail two/i })).toBeInTheDocument();
  await navigate(screen.getByRole('link', { name: /hidden x/i }));
  expect(screen.getByText(/You found the treasure!/i)).toBeInTheDocument();
});

test('it can navigate to routes with a base path', async () => {
  const basePath = 'base';
  const { navigate } = await render(RootComponent, {
    declarations: [DetailComponent, HiddenDetailComponent],
    routes: [
      {
        path: basePath,
        children: [
          {
            path: 'detail/:id',
            component: DetailComponent,
          },
          {
            path: 'hidden-detail',
            component: HiddenDetailComponent,
          },
        ],
      },
    ],
  });

  expect(screen.queryByRole('heading', { name: /Detail one/i })).not.toBeInTheDocument();

  await navigate(screen.getByRole('link', { name: /load one/i }), basePath);
  expect(screen.getByRole('heading', { name: /Detail one/i })).toBeInTheDocument();

  await navigate(screen.getByRole('link', { name: /load three/i }), basePath);
  expect(screen.queryByRole('heading', { name: /Detail one/i })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Detail three/i })).toBeInTheDocument();

  await navigate(screen.getByRole('link', { name: /back to parent/i }));
  expect(screen.queryByRole('heading', { name: /Detail three/i })).not.toBeInTheDocument();

  // It's possible to just use strings
  await navigate('base/detail/two?text=Hello&subtext=World');
  expect(screen.getByRole('heading', { name: /Detail two/i })).toBeInTheDocument();
  expect(screen.getByText(/Hello World/i)).toBeInTheDocument();

  await navigate('/hidden-detail', basePath);
  expect(screen.getByText(/You found the treasure!/i)).toBeInTheDocument();
});
