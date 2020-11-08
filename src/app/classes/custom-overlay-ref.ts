// R = Response Data Type, T = Data passed to Modal Type
import { Subject, timer } from 'rxjs';
import { CustomOverlayConfig, OverlayCloseEvent, OverlayCloseType } from '@models';
import { TemplateRef, Type } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { OverlayRef } from '@angular/cdk/overlay';

export class CustomOverlayRef<T = any, R = any> {
  afterClosed$ = new Subject<OverlayCloseEvent<R | null | undefined>>();
  container: HTMLElement;
  config: CustomOverlayConfig;

  constructor(
    public overlay: OverlayRef,
    public content: string | TemplateRef<any> | Type<any>,
    public data: T, // pass data to modal i.e. FormData
    public options?: CustomOverlayConfig,
  ) {
    if (options) {
      this.config = options;
    }
    overlay
      .backdropClick()
      .pipe(takeUntil(this.afterClosed$))
      .subscribe(() => this.close(null, 'backdropClick'));
  }

  close(data?: R | null, type: OverlayCloseType = 'close') {
    this._close(type, data);
  }

  private _close(type: OverlayCloseType, data: R | null | undefined): void {
    this.container.classList.remove(this.config.panelClass || '');
    timer(this.config.delay).subscribe(() => this.dispose(type, data));
  }

  private dispose(type: OverlayCloseType, data: R | null | undefined): void {
    this.overlay.dispose();
    this.afterClosed$.next({
      type,
      data,
    });

    this.afterClosed$.complete();
  }
}
