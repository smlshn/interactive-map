import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OverlayComponent } from '../overlay/overlay.component';

@Component({
  selector: 'iwp-overlay-modal',
  templateUrl: './overlay-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayModalComponent extends OverlayComponent implements OnInit {
  ngOnInit() {
    this.config = {
      panelClass: 'show',
      delay: 150,
    };
    super.ngOnInit();
  }
}
