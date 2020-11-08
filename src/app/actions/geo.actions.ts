import { Country, CountryUpdateType } from '@models';

export class GeoGetCountries {
  static readonly type = '[Geo] GetCountries';
}

export class GeoGetCountryFlags {
  static readonly type = '[Geo] GetCountryFlags';
}

export class GeoUpdateCountries {
  static readonly type = '[Geo] UpdateCountries';
  constructor(public readonly payload: Country[]) {}
}

export class GeoCountrySelect {
  static readonly type = '[Geo] CountrySelect';
  constructor(
    public readonly payload: {
      type: CountryUpdateType;
      country: Country;
    },
  ) {}
}
