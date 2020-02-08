import { Directive, HostListener, ElementRef, Input, Output, EventEmitter, Component } from '@angular/core';

import { render } from '../src/public_api';

@Directive({
  selector: '[onOff]',
})
export class OnOffDirective {
  @Input() on = 'on';
  @Input() off = 'off';
  @Output() clicked = new EventEmitter<string>();

  constructor(private el: ElementRef) {
    this.el.nativeElement.textContent = 'init';
  }

  @HostListener('click') onClick() {
    this.el.nativeElement.textContent = this.el.nativeElement.textContent === this.on ? this.off : this.on;
    this.clicked.emit(this.el.nativeElement.textContent);
  }
}
test('the directive renders', async () => {
  const component = await render(OnOffDirective, {
    template: '<div onOff></div>',
  });

  expect(component.container.querySelector('[onoff]')).toBeInTheDocument();
});

test('uses the default props', async () => {
  const component = await render(OnOffDirective, {
    template: '<div onOff></div>',
  });

  component.click(component.getByText('init'));
  component.click(component.getByText('on'));
  component.click(component.getByText('off'));
});

test('overrides input properties', async () => {
  const component = await render(OnOffDirective, {
    template: '<div onOff on="hello"></div>',
  });

  component.click(component.getByText('init'));
  component.click(component.getByText('hello'));
  component.click(component.getByText('off'));
});

test('overrides input properties via a wrapper', async () => {
  // `bar` will be set as a property on the wrapper component, the property will be used to pass to the directive
  const component = await render(OnOffDirective, {
    template: '<div onOff [on]="bar"></div>',
    componentProperties: {
      bar: 'hello',
    },
  });

  component.click(component.getByText('init'));
  component.click(component.getByText('hello'));
  component.click(component.getByText('off'));
});

test('overrides output properties', async () => {
  const clicked = jest.fn();

  const component = await render(OnOffDirective, {
    template: '<div onOff (clicked)="clicked($event)"></div>',
    componentProperties: {
      clicked,
    },
  });

  component.click(component.getByText('init'));
  expect(clicked).toHaveBeenCalledWith('on');

  component.click(component.getByText('on'));
  expect(clicked).toHaveBeenCalledWith('off');
});

test('should remove angular attributes', async () => {
  await render(OnOffDirective, {
    template: '<div onOff (clicked)="clicked($event)"></div>',
  });

  expect(document.querySelector('[ng-version]')).toBeNull();
  expect(document.querySelector('[id]')).toBeNull();
});

describe('removeAngularAttributes', () => {
  test('should remove angular attributes', async () => {
    await render(OnOffDirective, {
      template: '<div onOff (clicked)="clicked($event)"></div>',
    });

    expect(document.querySelector('[ng-version]')).toBeNull();
    expect(document.querySelector('[id]')).toBeNull();
  });

  test('can be disabled', async () => {
    await render(OnOffDirective, {
      template: '<div onOff (clicked)="clicked($event)"></div>',
      removeAngularAttributes: false,
    });

    expect(document.querySelector('[ng-version]')).not.toBeNull();
    expect(document.querySelector('[id]')).not.toBeNull();
  });
});
