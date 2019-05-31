import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { FireObject, Queries, queries, BoundFunction } from '@testing-library/dom';

export type RenderResultQueries<Q extends Queries = typeof queries> = { [P in keyof Q]: BoundFunction<Q[P]> };

export interface RenderResult extends RenderResultQueries, FireObject {
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
  queries?: Q;
  wrapper?: Type<any>;
}
