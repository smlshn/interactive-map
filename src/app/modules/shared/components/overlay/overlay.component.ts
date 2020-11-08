import { ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, Type, ViewChild } from '@angular/core';
import { CustomOverlayConfig, OverlayImpl } from '@models';
import { CustomOverlayRef } from '@classes';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayComponent<T = any> implements OnInit, OverlayImpl {
  @ViewChild('container', { static: true, read: ElementRef })
  container: ElementRef<HTMLElement>;

  contentType: 'template' | 'string' | 'component';
  content: string | TemplateRef<any> | Type<any>;
  context: any;
  config: CustomOverlayConfig;

  constructor(public ref: CustomOverlayRef<T>) {}

  ngOnInit() {
    this.attach();
    this.show();
    this.ref.container = this.container.nativeElement;
    if (this.ref.config) {
      this.ref.config = {
        ...this.ref.config,
        ...this.config,
      };
    } else {
      this.ref.config = this.config;
    }
  }

  show(): void {
    this.container.nativeElement.classList.add(this.config.panelClass || '');
  }

  private attach(): void {
    this.content = this.ref.content;

    if (typeof this.content === 'string') {
      this.contentType = 'string';
    } else if (this.content instanceof TemplateRef) {
      this.contentType = 'template';
      this.context = {
        close: this.ref.close.bind(this.ref),
      };
    } else {
      this.contentType = 'component';
    }
  }
}
