import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GeoCountrySelect } from '@actions';
import { GeoState } from '@states';
import { Observable } from 'rxjs';
import { Country, CountryUpdateType } from '@models';
import { AutoCompleteMapperFn } from '../../models';
import { OverlayService } from '@services';
import { CountryEditComponent } from '../country-edit/country-edit.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'iwp-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  @Select(GeoState.countries)
  filteredCountries$: Observable<Country[]>;

  mapperFn: AutoCompleteMapperFn<Country> = (list: Country[]) => {
    return list.map((item) => ({ label: item.properties.name, value: item }));
  };

  constructor(private store: Store, private overlayService: OverlayService) {}

  onSelect(country: Country): void {
    const ref = this.overlayService.openModal<Country, { country: Country; type: CountryUpdateType }>(
      CountryEditComponent,
      country,
    );
    ref.afterClosed$.pipe(take(1)).subscribe(({ data, type }) => {
      if (type === 'close') {
        this.store.dispatch(new GeoCountrySelect(data));
      }
    });
  }
}
