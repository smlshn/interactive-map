import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[fallback]',
})
export class ImgFallbackDirective {
  @Input()
  fallback: string;

  constructor(private elRef: ElementRef) {}

  @HostListener('error')
  onError() {
    const el: HTMLImageElement = this.elRef.nativeElement;
    el.src = this.fallback || 'https://via.placeholder.com/200?text=Flag';
  }
}
