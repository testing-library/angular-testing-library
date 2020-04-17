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

  await navigate(screen.getByText(/Load one/));
  expect(screen.queryByText(/Detail one/i)).toBeInTheDocument();

  await navigate(screen.getByText(/Load three/));
  expect(screen.queryByText(/Detail one/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Detail three/i)).toBeInTheDocument();

  await navigate(screen.getByText(/Back to parent/));
  expect(screen.queryByText(/Detail three/i)).not.toBeInTheDocument();

  await navigate(screen.getByText(/Load two/));
  expect(screen.queryByText(/Detail two/i)).toBeInTheDocument();
  await navigate(screen.getByText(/hidden x/));
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

  expect(screen.queryByText(/Detail one/i)).not.toBeInTheDocument();

  await navigate(screen.getByText(/Load one/), basePath);
  expect(screen.queryByText(/Detail one/i)).toBeInTheDocument();

  await navigate(screen.getByText(/Load three/), basePath);
  expect(screen.queryByText(/Detail one/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Detail three/i)).toBeInTheDocument();

  await navigate(screen.getByText(/Back to parent/));
  expect(screen.queryByText(/Detail three/i)).not.toBeInTheDocument();

  await navigate('base/detail/two?text=Hello&subtext=World'); // possible to just use strings
  expect(screen.queryByText(/Detail two/i)).toBeInTheDocument();
  expect(screen.queryByText(/Hello World/i)).toBeInTheDocument();

  await navigate('/hidden-detail', basePath);
  expect(screen.queryByText(/You found the treasure!/i)).toBeInTheDocument();
});
