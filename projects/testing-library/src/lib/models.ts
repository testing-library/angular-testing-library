import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { getQueriesForElement, FireObject } from 'dom-testing-library';

export interface RenderResult extends ReturnType<typeof getQueriesForElement>, FireObject {
  container: HTMLElement;
  debug: () => void;
  fixture: ComponentFixture<any>;
}

export interface Options {
  detectChanges?: boolean;
  declarations: any[];
  providers?: any[];
  imports?: any[];
  schemas?: any[];
}

export interface ComponentInput<T> {
  component: Type<T>;
  parameters?: Partial<T>;
}
