import { CountryFlag } from './country-flag';

export interface CountryList {
  features: Country[];
  type: string;
}

export interface Country {
  geometry: {
    coordinates: number[][][];
    type: string;
  };
  properties: {
    abbrev: string;
    abbrev_len: number;
    adm0_a3: string;
    adm0_a3_is: string;
    adm0_a3_un: number;
    adm0_a3_us: string;
    adm0_a3_wb: number;
    adm0_dif: number;
    admin: string;
    brk_a3: string;
    brk_diff: number;
    brk_group: string;
    brk_name: string;
    continent: string;
    economy: string;
    featurecla: string;
    fips_10: string;
    formal_en: string;
    formal_fr: string;
    gdp_md_est: number;
    gdp_year: number;
    geou_dif: number;
    geounit: string;
    gu_a3: string;
    homepart: number;
    income_grp: string;
    iso_a2: string;
    iso_a3: string;
    iso_n3: string;
    labelrank: number;
    lastcensus: number;
    level: number;
    long_len: number;
    mapcolor7: number;
    mapcolor8: number;
    mapcolor9: number;
    mapcolor13: number;
    name: string;
    name_alt: string;
    name_len: number;
    name_long: string;
    name_sort: string;
    note_adm0: string;
    note_brk: string;
    pop_est: number;
    pop_year: number;
    postal: string;
    region_un: string;
    region_wb: string;
    scalerank: number;
    sov_a3: string;
    sovereignt: string;
    su_a3: string;
    su_dif: number;
    subregion: string;
    subunit: string;
    tiny: number;
    type: string;
    un_a3: string;
    wb_a2: string;
    wb_a3: string;
    wikipedia: number;
    woe_id: number;
  };
  type: string;
  bbox: DOMRect;
  import: boolean;
  export: boolean;
  note: string;
  flag: CountryFlag;
  uuid: string;
}

export type CountryUpdateType = 'import' | 'export' | 'note' | 'reset';
