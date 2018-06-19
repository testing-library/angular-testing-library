import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

export interface Result<T> {
  container: HTMLElement;
  getFromTestBed: (token: any, notFoundValue?: any) => any;
  debug: () => void;
  fixture: ComponentFixture<any>;

  // Currently this isn't perfect because the typings from dom-testing-library are for TS 2.8
  // dom-testing-library queroes
  queryByPlaceholderText: any;
  queryAllByPlaceholderText: any;
  getByPlaceholderText: any;
  getAllByPlaceholderText: any;
  queryByText: any;
  queryAllByText: any;
  getByText: any;
  getAllByText: any;
  queryByLabelText: any;
  queryAllByLabelText: any;
  getByLabelText: any;
  getAllByLabelText: any;
  queryByAltText: any;
  queryAllByAltText: any;
  getByAltText: any;
  getAllByAltText: any;
  queryByTestId: any;
  queryAllByTestId: any;
  getByTestId: any;
  getAllByTestId: any;
  queryByTitle: any;
  queryAllByTitle: any;
  getByTitle: any;
  getAllByTitle: any;
  queryByValue: any;
  queryAllByValue: any;
  getByValue: any;
  getAllByValue: any;

  // dom-testing-library fireEvents
  copy: (element: HTMLElement, options?: {}) => boolean;
  cut: (element: HTMLElement, options?: {}) => boolean;
  paste: (element: HTMLElement, options?: {}) => boolean;
  compositionEnd: (element: HTMLElement, options?: {}) => boolean;
  compositionStart: (element: HTMLElement, options?: {}) => boolean;
  compositionUpdate: (element: HTMLElement, options?: {}) => boolean;
  keyDown: (element: HTMLElement, options?: {}) => boolean;
  keyPress: (element: HTMLElement, options?: {}) => boolean;
  keyUp: (element: HTMLElement, options?: {}) => boolean;
  focus: (element: HTMLElement, options?: {}) => boolean;
  blur: (element: HTMLElement, options?: {}) => boolean;
  change: (element: HTMLElement, options?: {}) => boolean;
  input: (element: HTMLElement, options?: {}) => boolean;
  invalid: (element: HTMLElement, options?: {}) => boolean;
  submit: (element: HTMLElement, options?: {}) => boolean;
  click: (element: HTMLElement, options?: {}) => boolean;
  contextMenu: (element: HTMLElement, options?: {}) => boolean;
  dblClick: (element: HTMLElement, options?: {}) => boolean;
  drag: (element: HTMLElement, options?: {}) => boolean;
  dragEnd: (element: HTMLElement, options?: {}) => boolean;
  dragEnter: (element: HTMLElement, options?: {}) => boolean;
  dragExit: (element: HTMLElement, options?: {}) => boolean;
  dragLeave: (element: HTMLElement, options?: {}) => boolean;
  dragOver: (element: HTMLElement, options?: {}) => boolean;
  dragStart: (element: HTMLElement, options?: {}) => boolean;
  drop: (element: HTMLElement, options?: {}) => boolean;
  mouseDown: (element: HTMLElement, options?: {}) => boolean;
  mouseEnter: (element: HTMLElement, options?: {}) => boolean;
  mouseLeave: (element: HTMLElement, options?: {}) => boolean;
  mouseMove: (element: HTMLElement, options?: {}) => boolean;
  mouseOut: (element: HTMLElement, options?: {}) => boolean;
  mouseOver: (element: HTMLElement, options?: {}) => boolean;
  mouseUp: (element: HTMLElement, options?: {}) => boolean;
  select: (element: HTMLElement, options?: {}) => boolean;
  touchCancel: (element: HTMLElement, options?: {}) => boolean;
  touchEnd: (element: HTMLElement, options?: {}) => boolean;
  touchMove: (element: HTMLElement, options?: {}) => boolean;
  touchStart: (element: HTMLElement, options?: {}) => boolean;
  scroll: (element: HTMLElement, options?: {}) => boolean;
  wheel: (element: HTMLElement, options?: {}) => boolean;
  abort: (element: HTMLElement, options?: {}) => boolean;
  canPlay: (element: HTMLElement, options?: {}) => boolean;
  canPlayThrough: (element: HTMLElement, options?: {}) => boolean;
  durationChange: (element: HTMLElement, options?: {}) => boolean;
  emptied: (element: HTMLElement, options?: {}) => boolean;
  encrypted: (element: HTMLElement, options?: {}) => boolean;
  ended: (element: HTMLElement, options?: {}) => boolean;
  loadedData: (element: HTMLElement, options?: {}) => boolean;
  loadedMetadata: (element: HTMLElement, options?: {}) => boolean;
  loadStart: (element: HTMLElement, options?: {}) => boolean;
  pause: (element: HTMLElement, options?: {}) => boolean;
  play: (element: HTMLElement, options?: {}) => boolean;
  playing: (element: HTMLElement, options?: {}) => boolean;
  progress: (element: HTMLElement, options?: {}) => boolean;
  rateChange: (element: HTMLElement, options?: {}) => boolean;
  seeked: (element: HTMLElement, options?: {}) => boolean;
  seeking: (element: HTMLElement, options?: {}) => boolean;
  stalled: (element: HTMLElement, options?: {}) => boolean;
  suspend: (element: HTMLElement, options?: {}) => boolean;
  timeUpdate: (element: HTMLElement, options?: {}) => boolean;
  volumeChange: (element: HTMLElement, options?: {}) => boolean;
  waiting: (element: HTMLElement, options?: {}) => boolean;
  load: (element: HTMLElement, options?: {}) => boolean;
  error: (element: HTMLElement, options?: {}) => boolean;
  animationStart: (element: HTMLElement, options?: {}) => boolean;
  animationEnd: (element: HTMLElement, options?: {}) => boolean;
  animationIteration: (element: HTMLElement, options?: {}) => boolean;
  transitionEnd: (element: HTMLElement, options?: {}) => boolean;
  doubleClick: (element: HTMLElement, options?: {}) => boolean;
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
