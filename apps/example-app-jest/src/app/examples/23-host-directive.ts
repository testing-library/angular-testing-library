import { Component, Directive, ElementRef, inject, input, OnInit } from '@angular/core';

@Directive({
  selector: '[atlText]',
})
export class TextDirective implements OnInit {
  private el = inject(ElementRef);
  atlText = input<string>('');

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
