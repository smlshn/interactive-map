import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, TemplateRef, Type } from '@angular/core';
import { CustomOverlayConfig } from '@models';
import { CustomOverlayRef } from '@classes';
import { OverlayModalComponent } from '../modules/shared/components/overlay-modal/overlay-modal.component';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  openModal<T = any, R = any>(
    content: string | TemplateRef<any> | Type<any>,
    data: T = {} as T,
    config?: CustomOverlayConfig,
  ): CustomOverlayRef<T, R> {
    return this.open(content, data, OverlayModalComponent, config);
  }

  private open<T = any, R = any>(
    content: string | TemplateRef<any> | Type<any>,
    data: T = {} as T,
    component: Type<any>,
    customConfig?: CustomOverlayConfig,
  ): CustomOverlayRef<T, R> {
    const config = this.createConfig();

    const overlayRef = this.overlay.create(config);

    const myOverlayRef = new CustomOverlayRef<T, R>(overlayRef, content, data, customConfig);

    const injector = this.createInjector(myOverlayRef, this.injector);

    overlayRef.attach(new ComponentPortal(component, null, injector));

    return myOverlayRef;
  }

  private createInjector(ref: CustomOverlayRef, inj: Injector) {
    return Injector.create({
      parent: inj,
      providers: [
        {
          provide: CustomOverlayRef,
          useValue: ref,
        },
      ],
    });
  }

  private createConfig(): OverlayConfig {
    return new OverlayConfig({
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      disposeOnNavigation: true,
    });
  }
}
