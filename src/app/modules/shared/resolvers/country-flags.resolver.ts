import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { GeoGetCountryFlags } from '@actions';
import { mapToNull } from '@utils';

@Injectable()
export class CountryFlagsResolver implements Resolve<null> {
  constructor(private store: Store) {}

  resolve(): Observable<null> {
    return this.store.dispatch(new GeoGetCountryFlags()).pipe(mapToNull());
  }
}
