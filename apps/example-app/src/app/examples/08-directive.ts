import { Directive, HostListener, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[atlSpoiler]',
})
export class SpoilerDirective implements OnInit {
  private el = inject(ElementRef);

  @Input() hidden = 'SPOILER';
  @Input() visible = 'I am visible now...';

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
