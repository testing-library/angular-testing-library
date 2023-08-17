import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MockComponent } from 'ng-mocks';
import { render } from '../../src/public_api';
import { NgIf } from '@angular/common';

test('sends the correct value to the child input', async () => {
  const utils = await render(TargetComponent, {
    imports: [MockComponent(ChildComponent)],
    componentInputs: { value: 'foo' },
  });

  const children = utils.fixture.debugElement.queryAll(By.directive(ChildComponent));
  expect(children).toHaveLength(1);

  const mockComponent = children[0].componentInstance;
  expect(mockComponent.someInput).toBe('foo');
});

test('sends the correct value to the child input 2', async () => {
  const utils = await render(TargetComponent, {
    imports: [MockComponent(ChildComponent)],
    componentInputs: { value: 'bar' },
  });

  const children = utils.fixture.debugElement.queryAll(By.directive(ChildComponent));
  expect(children).toHaveLength(1);

  const mockComponent = children[0].componentInstance;
  expect(mockComponent.someInput).toBe('bar');
});

@Component({
  selector: 'atl-child',
  template: 'child',
  standalone: true,
  imports: [NgIf],
})
class ChildComponent {
  @ContentChild('something')
  public injectedSomething: TemplateRef<void> | undefined;

  @Input()
  public someInput = '';

  @Output()
  public someOutput = new EventEmitter();

  public childMockComponent() {
    /* noop */
  }
}

@Component({
  selector: 'atl-target-mock-component',
  template: `<atl-child [someInput]="value" (someOutput)="trigger($event)"></atl-child> `,
  standalone: true,
  imports: [ChildComponent],
})
class TargetComponent {
  @Input() value = '';
  public trigger = (obj: any) => obj;
}
