import { TrackByFunction } from '@angular/core';

export function groupBy<T>(list: T[], predicate: (value: T) => any, valueMapFunction?: (value: T) => any): any {
  const map = {};
  list.forEach((item: T) => {
    const key = predicate(item);
    const collection = map[key];
    const value = valueMapFunction ? valueMapFunction(item) : item;
    !collection ? (map[key] = [value]) : collection.push(value);
  });
  return map;
}

export const createTrackBy = <T = null>(key?: keyof T): TrackByFunction<T> => (index, item) =>
  key ? item[key] || item || index : item;
