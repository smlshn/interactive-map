import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

export interface CacheConfig {
  key: string;
  value?: any;
  time: number; // minute
}

export interface CacheItem extends CacheConfig {
  cacheDate: number; // milliseconds
}

export type Cacheable = {
  cacheable?: boolean;
  [key: string]: any;
} & Partial<CacheConfig>;

export function withCache(params: Cacheable = {}): { params: Cacheable } {
  return {
    params: {
      cacheable: true,
      ...params,
    },
  };
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  constructor(private localStorageService: LocalStorageService) {}

  getFromCache(key: string): Observable<CacheItem> {
    return of(this.localStorageService.get(key)).pipe(
      switchMap((item: CacheItem) => {
        if (!item) {
          return of(null);
        }
        // if time === 0, then it is full cache, so time wont be expired
        const cacheExpired = item.time === 0 ? false : new Date().valueOf() >= item.cacheDate + item.time * 60 * 1000;
        if (cacheExpired) {
          this.localStorageService.remove(key);
          return of(null);
        }
        return of(item);
      }),
      take(1),
    );
  }

  updateCache(config: CacheConfig): void {
    this.getFromCache(config.key)
      .pipe(switchMap((cache) => this.setToCache(cache ? { ...cache, value: config.value } : config)))
      .subscribe();
  }

  setToCache(item: CacheConfig): Observable<CacheItem> {
    const cache = {
      key: item.key,
      value: item.value,
      time: item.time || 0,
      cacheDate: new Date().valueOf(),
    } as CacheItem;

    this.localStorageService.set(item.key, cache);
    return of(cache);
  }
}
