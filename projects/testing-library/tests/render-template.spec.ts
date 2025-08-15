import { Directive, HostListener, ElementRef, Input, Output, EventEmitter, Component, inject } from '@angular/core';

import { render, fireEvent, screen } from '../src/public_api';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[onOff]',
})
class OnOffDirective {
  private el = inject(ElementRef);
  @Input() on = 'on';
  @Input() off = 'off';
  @Output() clicked = new EventEmitter<string>();

  constructor() {
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
  private readonly el = inject(ElementRef);
  @Input()
  set update(value: any) {
    this.el.nativeElement.textContent = value;
  }
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
  const view = await render('<div onOff></div>', {
    imports: [OnOffDirective],
  });

  // eslint-disable-next-line testing-library/no-container
  expect(view.container.querySelector('[onoff]')).toBeInTheDocument();
});

test('the component renders', async () => {
  const view = await render('<greeting name="Angular"></greeting>', {
    imports: [GreetingComponent],
  });

  // eslint-disable-next-line testing-library/no-container
  expect(view.container.querySelector('greeting')).toBeInTheDocument();
  expect(screen.getByText('Hello Angular!')).toBeInTheDocument();
});

test('uses the default props', async () => {
  await render('<div onOff></div>', {
    imports: [OnOffDirective],
  });

  fireEvent.click(screen.getByText('init'));
  fireEvent.click(screen.getByText('on'));
  fireEvent.click(screen.getByText('off'));
});

test('overrides input properties', async () => {
  await render('<div onOff on="hello"></div>', {
    imports: [OnOffDirective],
  });

  fireEvent.click(screen.getByText('init'));
  fireEvent.click(screen.getByText('hello'));
  fireEvent.click(screen.getByText('off'));
});

test('overrides input properties via a wrapper', async () => {
  // `bar` will be set as a property on the wrapper component, the property will be used to pass to the directive
  await render('<div onOff [on]="bar"></div>', {
    imports: [OnOffDirective],
    componentProperties: {
      bar: 'hello',
    },
  });

  fireEvent.click(screen.getByText('init'));
  fireEvent.click(screen.getByText('hello'));
  fireEvent.click(screen.getByText('off'));
});

test('overrides output properties', async () => {
  const clicked = jest.fn();

  await render('<div onOff (clicked)="clicked($event)"></div>', {
    imports: [OnOffDirective],
    componentProperties: {
      clicked,
    },
  });

  fireEvent.click(screen.getByText('init'));
  expect(clicked).toHaveBeenCalledWith('on');

  fireEvent.click(screen.getByText('on'));
  expect(clicked).toHaveBeenCalledWith('off');
});

describe('removeAngularAttributes', () => {
  it('should remove angular attributes', async () => {
    await render('<div onOff (clicked)="clicked($event)"></div>', {
      imports: [OnOffDirective],
      removeAngularAttributes: true,
    });

    expect(document.querySelector('[ng-version]')).toBeNull();
    expect(document.querySelector('[id]')).toBeNull();
  });

  it('is disabled by default', async () => {
    await render('<div onOff (clicked)="clicked($event)"></div>', {
      imports: [OnOffDirective],
    });

    expect(document.querySelector('[ng-version]')).not.toBeNull();
    expect(document.querySelector('[id]')).not.toBeNull();
  });
});

test('updates properties and invokes change detection', async () => {
  const view = await render<{ value: string }>('<div [update]="value" ></div>', {
    imports: [UpdateInputDirective],
    componentProperties: {
      value: 'value1',
    },
  });

  expect(screen.getByText('value1')).toBeInTheDocument();
  view.fixture.componentInstance.value = 'updated value';
  expect(screen.getByText('updated value')).toBeInTheDocument();
});
