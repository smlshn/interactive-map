import { Country } from './country-list';

export interface Continent {
  name: string;
  shortCode: string;
  countries: Country[];
  importCountries: Country[];
  exportCountries: Country[];
}
