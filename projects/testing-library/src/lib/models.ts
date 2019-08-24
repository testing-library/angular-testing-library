import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { FireObject, Queries, queries, BoundFunction } from '@testing-library/dom';
import { UserEvents } from './user-events';

export type RenderResultQueries<Q extends Queries = typeof queries> = { [P in keyof Q]: BoundFunction<Q[P]> };

export interface RenderResult extends RenderResultQueries, FireObject, UserEvents {
  container: HTMLElement;
  debug: (element?: HTMLElement) => void;
  fixture: ComponentFixture<any>;
}

export interface RenderOptions<C, Q extends Queries = typeof queries> {
  detectChanges?: boolean;
  declarations?: any[];
  providers?: any[];
  imports?: any[];
  schemas?: any[];
  componentProperties?: Partial<C>;
  componentProviders?: any[];
  queries?: Q;
  wrapper?: Type<any>;
  /**
   * Exclude the component to be automatically be added as a declaration
   * This is needed when the component is declared in an imported module
   */
  excludeComponentDeclaration?: boolean;
}
