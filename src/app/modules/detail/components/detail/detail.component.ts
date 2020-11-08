import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GeoState } from '@states';
import { Observable } from 'rxjs';
import { Continent, Country, CountryList } from '@models';
import { GeoUpdateCountries } from '@actions';
import { createTrackBy } from '@utils';

@Component({
  selector: 'iwp-detail',
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent {
  @Select(GeoState.countryResponse)
  countries$: Observable<CountryList>;

  @Select(GeoState.continents)
  continents$: Observable<Continent[]>;

  trackByContinent = createTrackBy<Continent>('shortCode');

  constructor(private store: Store) {}

  onMapUpdate(event: Country[]) {
    this.store.dispatch(new GeoUpdateCountries(event));
  }
}
