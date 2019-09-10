import { render } from '@testing-library/angular';

import { DetailComponent, MasterComponent, HiddenDetailComponent } from './09-router';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

test('it can navigate to routes', async () => {
  const component = await render(MasterComponent, {
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

  expect(component.queryByText(/Detail one/i)).not.toBeInTheDocument();

  await component.navigate(component.getByText(/Load one/));
  expect(component.queryByText(/Detail one/i)).toBeInTheDocument();

  await component.navigate(component.getByText(/Load three/));
  expect(component.queryByText(/Detail one/i)).not.toBeInTheDocument();
  expect(component.queryByText(/Detail three/i)).toBeInTheDocument();

  await component.navigate(component.getByText(/Back to parent/));
  expect(component.queryByText(/Detail three/i)).not.toBeInTheDocument();

  await component.navigate(component.getByText(/Load two/));
  expect(component.queryByText(/Detail two/i)).toBeInTheDocument();
  await component.navigate(component.getByText(/hidden x/));
  expect(component.queryByText(/You found the treasure!/i)).toBeInTheDocument();
});

test('it can navigate to routes with a base path', async () => {
  const basePath = 'base';
  const component = await render(MasterComponent, {
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

  expect(component.queryByText(/Detail one/i)).not.toBeInTheDocument();

  await component.navigate(component.getByText(/Load one/), basePath);
  expect(component.queryByText(/Detail one/i)).toBeInTheDocument();

  await component.navigate(component.getByText(/Load three/), basePath);
  expect(component.queryByText(/Detail one/i)).not.toBeInTheDocument();
  expect(component.queryByText(/Detail three/i)).toBeInTheDocument();

  await component.navigate(component.getByText(/Back to parent/));
  expect(component.queryByText(/Detail three/i)).not.toBeInTheDocument();

  await component.navigate('base/detail/two'); // possible to just use strings
  expect(component.queryByText(/Detail two/i)).toBeInTheDocument();
  await component.navigate('/hidden-detail', basePath);
  expect(component.queryByText(/You found the treasure!/i)).toBeInTheDocument();
});
