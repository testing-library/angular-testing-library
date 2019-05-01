import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { FireObject, Queries, queries, BoundFunction } from 'dom-testing-library';

export type RenderResultQueries<Q extends Queries = typeof queries> = { [P in keyof Q]: BoundFunction<Q[P]> };

export interface RenderResult extends RenderResultQueries, FireObject {
  container: HTMLElement;
  debug: (element?: HTMLElement) => void;
  fixture: ComponentFixture<any>;
}

export interface RenderOptions<W = any, Q extends Queries = typeof queries> {
  detectChanges?: boolean;
  declarations: any[];
  providers?: any[];
  imports?: any[];
  schemas?: any[];
  queries?: Q;
  wrapper?: Type<W>;
}

export interface ComponentInput<T> {
  component: Type<T>;
  parameters?: Partial<T>;
}
