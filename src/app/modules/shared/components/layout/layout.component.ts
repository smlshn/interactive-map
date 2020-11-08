import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'iwp-layout',
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
