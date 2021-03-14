import { Directive, HostListener, ElementRef, Input, Output, EventEmitter, Component } from '@angular/core';

import { render, fireEvent } from '../src/public_api';

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

@Directive({
  selector: '[update]',
})
export class UpdateInputDirective {
  @Input()
  set update(value: any) {
    this.el.nativeElement.textContent = value;
  }

  constructor(private el: ElementRef) {}
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

  fireEvent.click(component.getByText('init'));
  fireEvent.click(component.getByText('on'));
  fireEvent.click(component.getByText('off'));
});

test('overrides input properties', async () => {
  const component = await render(OnOffDirective, {
    template: '<div onOff on="hello"></div>',
  });

  fireEvent.click(component.getByText('init'));
  fireEvent.click(component.getByText('hello'));
  fireEvent.click(component.getByText('off'));
});

test('overrides input properties via a wrapper', async () => {
  // `bar` will be set as a property on the wrapper component, the property will be used to pass to the directive
  const component = await render(OnOffDirective, {
    template: '<div onOff [on]="bar"></div>',
    componentProperties: {
      bar: 'hello',
    },
  });

  fireEvent.click(component.getByText('init'));
  fireEvent.click(component.getByText('hello'));
  fireEvent.click(component.getByText('off'));
});

test('overrides output properties', async () => {
  const clicked = jest.fn();

  const component = await render(OnOffDirective, {
    template: '<div onOff (clicked)="clicked($event)"></div>',
    componentProperties: {
      clicked,
    },
  });

  fireEvent.click(component.getByText('init'));
  expect(clicked).toHaveBeenCalledWith('on');

  fireEvent.click(component.getByText('on'));
  expect(clicked).toHaveBeenCalledWith('off');
});

describe('removeAngularAttributes', () => {
  test('should remove angular attributes', async () => {
    await render(OnOffDirective, {
      template: '<div onOff (clicked)="clicked($event)"></div>',
      removeAngularAttributes: true,
    });

    expect(document.querySelector('[ng-version]')).toBeNull();
    expect(document.querySelector('[id]')).toBeNull();
  });

  test('is disabled by default', async () => {
    await render(OnOffDirective, {
      template: '<div onOff (clicked)="clicked($event)"></div>',
    });

    expect(document.querySelector('[ng-version]')).not.toBeNull();
    expect(document.querySelector('[id]')).not.toBeNull();
  });
});


test('updates properties and invokes change detection', async () => {
  const component = await render(UpdateInputDirective, {
    template: '<div [update]="value" ></div>',
    componentProperties: {
      value: 'value1'
    }
  });

  component.getByText('value1')
  component.fixture.componentInstance.value = 'updated value'
  component.getByText('updated value')
});
