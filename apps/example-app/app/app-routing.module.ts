import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleComponent } from './examples/00-single-component';
import { NestedContainerComponent } from './examples/01-nested-component';
import { InputOutputComponent } from './examples/02-input-output';
import { FormsComponent } from './examples/03-forms';
import { MaterialFormsComponent } from './examples/04-forms-with-material';
import { ComponentWithProviderComponent } from './examples/05-component-provider';
import { WithNgRxStoreComponent } from './examples/06-with-ngrx-store';
import { WithNgRxMockStoreComponent } from './examples/07-with-ngrx-mock-store';
import { MasterComponent, DetailComponent, HiddenDetailComponent } from './examples/09-router';

export const examples = [
  {
    path: 'single-component',
    component: SingleComponent,
    data: {
      name: 'Single component',
    },
  },
  {
    path: 'nested-component',
    component: NestedContainerComponent,
    data: {
      name: 'Nested components',
    },
  },
  {
    path: 'input-output',
    component: InputOutputComponent,
    data: {
      name: 'Input and Output',
    },
  },
  {
    path: 'forms',
    component: FormsComponent,
    data: {
      name: 'Form',
    },
  },
  {
    path: 'forms-material',
    component: MaterialFormsComponent,
    data: {
      name: 'Material form',
    },
  },
  {
    path: 'component-with-provider',
    component: ComponentWithProviderComponent,
    data: {
      name: 'With provider',
    },
  },
  {
    path: 'with-ngrx-store',
    component: WithNgRxStoreComponent,
    data: {
      name: 'With NgRx Store',
    },
  },
  {
    path: 'with-ngrx-mock-store',
    component: WithNgRxMockStoreComponent,
    data: {
      name: 'With NgRx MockStore',
    },
  },
  {
    path: 'with-router',
    component: MasterComponent,
    data: {
      name: 'Router',
    },
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
];

export const routes: Routes = [
  {
    path: '',
    children: examples,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
