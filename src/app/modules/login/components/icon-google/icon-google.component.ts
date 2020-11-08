import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'iwp-icon-google',
  templateUrl: './icon-google.component.svg',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconGoogleComponent {
  @Input()
  width = '20';

  @Input()
  height = '20';

  @Input()
  color: 'white' | 'black' = 'white';

  get classes(): string {
    return `svg-fill-${this.color}`;
  }
}
