import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { render } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: ` {{ name }} `,
})
class FixtureComponent {
  @Input() name = 'Sarah';
}

test('will rerender the component with updated props', async () => {
  const component = await render(FixtureComponent);
  component.getByText('Sarah');

  const name = 'Mark';
  component.rerender({
    name,
  });

  component.getByText(name);
});

@Component({
  selector: 'fixture-onchanges',
  template: ` {{ name }} `,
})
class FixtureWithNgOnChangesComponent implements OnChanges {
  @Input() name = 'Sarah';
  @Input() nameChanged: (name: string, isFirstChange: boolean) => void;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.name && this.nameChanged) {
      this.nameChanged(changes.name.currentValue, changes.name.isFirstChange());
    }
  }
}

test('will call ngOnChanges on rerender', async () => {
  const nameChanged = jest.fn();
  const componentProperties = { nameChanged };
  const component = await render(FixtureWithNgOnChangesComponent, {componentProperties});
  component.getByText('Sarah');

  const name = 'Mark';
  component.rerender({
    name,
  });

  component.getByText(name);
  expect(nameChanged).toBeCalledWith(name, false);
})
