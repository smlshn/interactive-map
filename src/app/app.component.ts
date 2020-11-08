import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'iwp-root',
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
