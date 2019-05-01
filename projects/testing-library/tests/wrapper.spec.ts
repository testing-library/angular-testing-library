import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { render } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: `
    <p>rawr</p>
  `,
})
class FixtureComponent {}

@Component({ selector: 'wrapper-component', template: '' })
class WrapperComponent implements OnInit {
  constructor(private elemtRef: ElementRef) {}

  ngOnInit() {
    const textnode = document.createTextNode('I should be visible');
    this.elemtRef.nativeElement.appendChild(textnode);
  }
}

test('allows for a custom wrapper', async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  const { getByText } = await render('<fixture></fixture>', {
    declarations: [FixtureComponent],
    wrapper: WrapperComponent,
  });

  getByText('I should be visible');
});
