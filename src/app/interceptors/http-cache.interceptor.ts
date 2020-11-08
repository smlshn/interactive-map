import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { CacheService } from '@services';

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cacheable = request.params.get('cacheable');
    if (!cacheable) {
      return next.handle(request);
    }

    if (request.method === 'GET' && request.responseType === 'json') {
      const time = +request.params.get('time');
      const key = request.params.get('key');
      return this.cacheService.getFromCache(key).pipe(
        switchMap((cache) => {
          if (cache) {
            return of(new HttpResponse({ body: cache.value }));
          }
          return next.handle(request).pipe(
            tap((event) => {
              if (event instanceof HttpResponse) {
                return this.cacheService.setToCache({
                  key,
                  time,
                  value: event.body,
                });
              }
              return event;
            }),
          );
        }),
      );
    }

    return next.handle(request);
  }
}
