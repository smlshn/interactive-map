import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { GeoGetCountries } from '@actions';
import { mapToNull } from '@utils';
import { switchMap } from 'rxjs/operators';
import { CountryFlagsResolver } from './country-flags.resolver';

@Injectable()
export class GeoDataResolver implements Resolve<null> {
  constructor(private store: Store, private countryFlagsResolver: CountryFlagsResolver) {}

  resolve(): Observable<null> {
    return this.countryFlagsResolver.resolve().pipe(
      switchMap(() => this.store.dispatch(new GeoGetCountries())),
      mapToNull(),
    );
  }
}
