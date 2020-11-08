import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Continent } from '@models';

@Component({
  selector: 'iwp-continent-card',
  templateUrl: './continent-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContinentCardComponent {
  @Input()
  continent: Continent;
}
