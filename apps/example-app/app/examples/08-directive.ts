import { Directive, HostListener, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appSpoiler]',
})
export class SpoilerDirective implements OnInit {
  @Input() hidden = 'SPOILER';
  @Input() visible = 'I am visible now...';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.textContent = this.hidden;
  }

  @HostListener('mouseover')
  onMouseOver() {
    this.el.nativeElement.textContent = this.visible;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.textContent = this.hidden;
  }
}
