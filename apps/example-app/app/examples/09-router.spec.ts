import { render, screen } from '@testing-library/angular';

import { DetailComponent, MasterComponent, HiddenDetailComponent } from './09-router';

test('it can navigate to routes', async () => {
  const { navigate } = await render(MasterComponent, {
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
  expect(screen.queryByRole('heading', { name: /Detail one/i })).toBeInTheDocument();

  await navigate(screen.getByRole('link', { name: /load three/i }));
  expect(screen.queryByRole('heading', { name: /Detail one/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /Detail three/i })).toBeInTheDocument();

  await navigate(screen.getByRole('link', { name: /back to parent/i }));
  expect(screen.queryByRole('heading', { name: /Detail three/i })).not.toBeInTheDocument();

  await navigate(screen.getByRole('link', { name: /load two/i }));
  expect(screen.queryByRole('heading', { name: /Detail two/i })).toBeInTheDocument();
  await navigate(screen.getByRole('link', { name: /hidden x/i }));
  expect(screen.queryByText(/You found the treasure!/i)).toBeInTheDocument();
});

test('it can navigate to routes with a base path', async () => {
  const basePath = 'base';
  const { navigate } = await render(MasterComponent, {
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
  expect(screen.queryByRole('heading', { name: /Detail one/i })).toBeInTheDocument();

  await navigate(screen.getByRole('link', { name: /load three/i }), basePath);
  expect(screen.queryByRole('heading', { name: /Detail one/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /Detail three/i })).toBeInTheDocument();

  await navigate(screen.getByRole('link', { name: /back to parent/i }));
  expect(screen.queryByRole('heading', { name: /Detail three/i })).not.toBeInTheDocument();

  // It's possible to just use strings
  await navigate('base/detail/two?text=Hello&subtext=World');
  expect(screen.queryByRole('heading', { name: /Detail two/i })).toBeInTheDocument();
  expect(screen.getByText(/Hello World/i)).toBeInTheDocument();

  await navigate('/hidden-detail', basePath);
  expect(screen.queryByText(/You found the treasure!/i)).toBeInTheDocument();
});
