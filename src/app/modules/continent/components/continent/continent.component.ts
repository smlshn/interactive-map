import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { Continent, Country } from '@models';
import { Store } from '@ngxs/store';
import { GeoState } from '@states';
import { createTrackBy } from '@utils';

@Component({
  selector: 'iwp-continent',
  templateUrl: './continent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContinentComponent implements OnInit {
  continent$: Observable<Continent>;

  trackByCountry = createTrackBy<Country>('uuid');

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.getContinent();
  }

  private getContinent(): void {
    this.continent$ = this.route.params.pipe(
      pluck('shortCode'),
      switchMap((shortCode: string) => this.store.select(GeoState.getContinentByShortCode(shortCode))),
    );
  }
}
