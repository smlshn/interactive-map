import { Attribute, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomOverlayRef } from '@classes';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'iwp-modal-header',
  template: `
    <div class="modal-header">
      <h3 class="mb-0" *ngIf="modalTitle">{{ modalTitle }}</h3>
      <button type="button" class="close" (click)="ref.close(null, 'headerClick')">
        <fa-icon [icon]="faTimes"></fa-icon>
      </button>
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalHeaderComponent {
  faTimes = faTimes;

  @Input()
  modalTitle: string;

  constructor(public ref: CustomOverlayRef) {}
}

@Component({
  selector: 'iwp-modal-body',
  template: `
    <div class="modal-body">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalBodyComponent {}

@Component({
  selector: 'iwp-modal-footer',
  template: `
    <div class="modal-footer">
      <button class="btn btn-outline-secondary" [ngClass]="dataConfirm ? 'mr-2' : ''" (click)="ref.close()">
        Close
      </button>
      <button *ngIf="dataConfirm" (click)="onconfirm.emit()">
        {{ confirmButtonText }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalFooterComponent {
  @Input()
  cancelButtonDisabled = false;

  @Input()
  confirmButtonDisabled: boolean;

  @Input()
  confirmButtonText = 'Confirm';

  @Output()
  onconfirm = new EventEmitter();

  constructor(@Attribute('data-confirm') public dataConfirm: boolean, public ref: CustomOverlayRef) {
    this.dataConfirm = dataConfirm !== null;
  }
}

@Component({
  selector: 'iwp-modal',
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {}
