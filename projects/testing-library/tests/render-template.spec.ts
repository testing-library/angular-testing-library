import { Directive, HostListener, ElementRef, Input, Output, EventEmitter, Component } from '@angular/core';

import { render, fireEvent } from '../src/public_api';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[onOff]',
})
class OnOffDirective {
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
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[update]',
})
class UpdateInputDirective {
  @Input()
  set update(value: any) {
    this.el.nativeElement.textContent = value;
  }

  constructor(private el: ElementRef) {}
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'greeting',
  template: 'Hello {{ name }}!',
})
class GreetingComponent {
  @Input() name = 'World';
}

test('the directive renders', async () => {
  const component = await render('<div onOff></div>', {
    declarations: [OnOffDirective],
  });

  expect(component.container.querySelector('[onoff]')).toBeInTheDocument();
});

test('the component renders', async () => {
  const component = await render('<greeting name="Angular"></greeting>', {
    declarations: [GreetingComponent],
  });

  expect(component.container.querySelector('greeting')).toBeInTheDocument();
  expect(component.getByText('Hello Angular!')).toBeInTheDocument();
});

test('the directive renders (compatibility with the deprecated signature)', async () => {
  const component = await render(OnOffDirective, {
    template: '<div onOff></div>',
  });

  expect(component.container.querySelector('[onoff]')).toBeInTheDocument();
});

test('uses the default props', async () => {
  const component = await render('<div onOff></div>', {
    declarations: [OnOffDirective],
  });

  fireEvent.click(component.getByText('init'));
  fireEvent.click(component.getByText('on'));
  fireEvent.click(component.getByText('off'));
});

test('overrides input properties', async () => {
  const component = await render('<div onOff on="hello"></div>', {
    declarations: [OnOffDirective],
  });

  fireEvent.click(component.getByText('init'));
  fireEvent.click(component.getByText('hello'));
  fireEvent.click(component.getByText('off'));
});

test('overrides input properties via a wrapper', async () => {
  // `bar` will be set as a property on the wrapper component, the property will be used to pass to the directive
  const component = await render('<div onOff [on]="bar"></div>', {
    declarations: [OnOffDirective],
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

  const component = await render('<div onOff (clicked)="clicked($event)"></div>', {
    declarations: [OnOffDirective],
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
  it('should remove angular attributes', async () => {
    await render('<div onOff (clicked)="clicked($event)"></div>', {
      declarations: [OnOffDirective],
      removeAngularAttributes: true,
    });

    expect(document.querySelector('[ng-version]')).toBeNull();
    expect(document.querySelector('[id]')).toBeNull();
  });

  it('is disabled by default', async () => {
    await render('<div onOff (clicked)="clicked($event)"></div>', {
      declarations: [OnOffDirective],
    });

    expect(document.querySelector('[ng-version]')).not.toBeNull();
    expect(document.querySelector('[id]')).not.toBeNull();
  });
});

test('updates properties and invokes change detection', async () => {
  const component = await render('<div [update]="value" ></div>', {
    declarations: [UpdateInputDirective],
    componentProperties: {
      value: 'value1',
    },
  });

  component.getByText('value1');
  component.fixture.componentInstance.value = 'updated value';
  component.getByText('updated value');
});
