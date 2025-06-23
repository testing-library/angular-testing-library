import { Component, Directive, ElementRef, input, OnInit } from '@angular/core';

@Directive({
  selector: '[atlText]',
})
export class TextDirective implements OnInit {
  atlText = input<string>('');

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.textContent = this.atlText();
  }
}

@Component({
  selector: 'atl-host-directive',
  template: ``,
  hostDirectives: [{ directive: TextDirective, inputs: ['atlText'] }],
})
export class HostDirectiveComponent {}
