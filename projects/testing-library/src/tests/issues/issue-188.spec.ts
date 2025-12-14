// https://github.com/testing-library/angular-testing-library/issues/188
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { test, expect } from 'vitest';
import { render, screen } from '../../public_api';

@Component({
  template: `<h1>Hello {{ formattedName }}</h1>`,
})
class BugOnChangeComponent implements OnChanges {
  @Input() name?: string;

  formattedName?: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['name']) {
      this.formattedName = changes['name'].currentValue.toUpperCase();
    }
  }
}

test('should output formatted name after rendering', async () => {
  await render(BugOnChangeComponent, { componentProperties: { name: 'name' } });

  expect(screen.getByText('Hello NAME')).toBeInTheDocument();
});
