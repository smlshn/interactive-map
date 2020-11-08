import { Injectable } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { Continent, Country, CountryFlag, CountryList } from '@models';
import { GeoGetCountries, GeoGetCountryFlags, GeoUpdateCountries } from '@actions';
import { CacheService, GeoDataService } from '@services';
import { tap } from 'rxjs/operators';
import { groupBy } from '@utils';
import { nanoid } from 'nanoid';
import { GEO_DATA_CACHE_CONFIG } from '@constants';

export interface GeoStateModel {
  countryResponse: CountryList;
  continents: Continent[];
  countryFlags: CountryFlag[];
}

@Injectable()
@State<GeoStateModel>({
  name: 'GeoState',
  defaults: {
    countryResponse: {} as CountryList,
    continents: [],
    countryFlags: [],
  },
})
export class GeoState {
  @Selector()
  static countryResponse({ countryResponse }: GeoStateModel) {
    return countryResponse;
  }

  @Selector()
  static countries({ countryResponse }: GeoStateModel) {
    return countryResponse.features;
  }

  @Selector()
  static continents({ continents }: GeoStateModel) {
    return continents;
  }

  static getContinentByShortCode(shortCode: string) {
    return createSelector([GeoState], ({ continents }: GeoStateModel) =>
      continents.find((item) => item.shortCode === shortCode),
    );
  }

  constructor(private geoDataService: GeoDataService, private cacheService: CacheService) {}

  @Action(GeoGetCountryFlags)
  getCountryFlags({ patchState }: StateContext<GeoStateModel>) {
    return this.geoDataService.getCountryFlags$().pipe(tap((countryFlags) => patchState({ countryFlags })));
  }

  @Action(GeoGetCountries)
  getCountries(context: StateContext<GeoStateModel>) {
    return this.geoDataService
      .getCountries$()
      .pipe(tap((countryResponse) => this.processGeoJson(countryResponse, context)));
  }

  @Action(GeoUpdateCountries)
  updateCountries({ getState, patchState }: StateContext<GeoStateModel>, { payload }: GeoUpdateCountries) {
    const { countryResponse } = getState();
    const continents = this.processContinents(payload);
    const updated = { ...countryResponse, features: payload } as CountryList;
    this.updateCache(updated);
    patchState({ countryResponse: updated, continents });
  }

  private processGeoJson(countryResponse: CountryList, context: StateContext<GeoStateModel>) {
    const { countryFlags } = context.getState();

    const normalized = {
      ...countryResponse,
      features: countryResponse.features.map((item) => ({
        ...item,
        note: item.note || null,
        export: item.export || false,
        import: item.import || false,
        flag: countryFlags.find((flag) => flag.alpha3 === item.properties.iso_a3),
        uuid: nanoid(5),
      })),
    } as CountryList;

    const continents = this.processContinents(normalized.features);

    context.patchState({ countryResponse: normalized, continents });
  }

  private processContinents(items: Country[]): Continent[] {
    const grouped = groupBy(items, (item) => item.properties.continent);
    return Object.keys(grouped)
      .map((key) => {
        const countries = grouped[key] as Country[];
        const { imports, exports } = countries.reduce(
          (acc, country) => {
            return {
              ...acc,
              imports: [...acc.imports, ...(country.import ? [country] : [])],
              exports: [...acc.exports, ...(country.export ? [country] : [])],
            };
          },
          { imports: [], exports: [] },
        );
        return {
          name: key,
          shortCode: key.toLowerCase().replace(/ /g, '_').replace(/[()]/g, ''),
          countries,
          importCountries: imports,
          exportCountries: exports,
        } as Continent;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private updateCache(value: CountryList): void {
    this.cacheService.updateCache({
      ...GEO_DATA_CACHE_CONFIG,
      value,
    });
  }
}
