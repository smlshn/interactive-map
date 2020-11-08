import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountryFlag, CountryList } from '@models';
import { withCache } from './cache.service';
import { GEO_DATA_CACHE_CONFIG, GEO_DATA_FLAG_CACHE_CONFIG } from '@constants';

@Injectable({
  providedIn: 'root',
})
export class GeoDataService {
  private readonly GEO_DATA_URL =
    'https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json';
  private readonly GEO_DATA_FLAG_URL =
    'https://raw.githubusercontent.com/linssen/country-flag-icons/master/countries.json';

  constructor(private http: HttpClient) {}

  getCountries$(): Observable<CountryList> {
    return this.http.get<CountryList>(this.GEO_DATA_URL, withCache(GEO_DATA_CACHE_CONFIG));
  }

  getCountryFlags$(): Observable<CountryFlag[]> {
    return this.http.get<CountryFlag[]>(this.GEO_DATA_FLAG_URL, withCache(GEO_DATA_FLAG_CACHE_CONFIG));
  }
}
