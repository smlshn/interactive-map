import { Observable, pipe, UnaryFunction } from 'rxjs';
import { mapTo } from 'rxjs/operators';

export function mapToNull(): UnaryFunction<Observable<any>, Observable<null>> {
  return pipe(mapTo(null));
}
