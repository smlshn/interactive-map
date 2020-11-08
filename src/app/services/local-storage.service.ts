import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';

export type FilteredStorageEvent = Pick<StorageEvent, 'key' | 'newValue' | 'oldValue'>;

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private listener: Observable<StorageEvent>;
  private readonly prefix = 'iwp';

  get(key: string): any {
    return JSON.parse(localStorage.getItem(`${this.prefix}-${key}`));
  }

  set(key: string, value: any): void {
    localStorage.setItem(`${this.prefix}-${key}`, JSON.stringify(value));
  }

  remove(key: string | string[]): void {
    const keys: string[] = (Array.isArray(key) ? key : [key]) as string[];

    keys.forEach((itemKey) => localStorage.removeItem(`${this.prefix}-${itemKey}`));
  }

  clear(): void {
    localStorage.clear();
  }

  listenStorage(): Observable<StorageEvent> {
    this.listener = fromEvent(window, 'storage').pipe(share()) as Observable<StorageEvent>;
    return this.listener;
  }

  listenStorageItem(itemKey: string): Observable<FilteredStorageEvent> {
    return (!this.listener ? this.listenStorage() : this.listener).pipe(
      filter((event) => `${this.prefix}-${itemKey}` === event.key),
      map(({ key, newValue, oldValue }: StorageEvent) => ({
        key,
        newValue,
        oldValue,
      })),
    );
  }
}
