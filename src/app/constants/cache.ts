import { CacheConfig } from '@services';

export const GEO_DATA_CACHE_CONFIG: CacheConfig = {
  time: 30,
  key: 'countries',
};

export const GEO_DATA_FLAG_CACHE_CONFIG: CacheConfig = {
  time: 30,
  key: 'country-flags',
};
