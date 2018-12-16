export interface DataTableItem {
  results?: Result[];
  info?:    Info;
}

export interface Info {
  seed?:    string;
  results?: number;
  page?:    number;
  version?: string;
}

export interface Result {
  gender?:     Gender;
  name?:       NameClass;
  location?:   Location;
  email?:      string;
  login?:      Login;
  dob?:        Dob;
  registered?: Dob;
  phone?:      string;
  cell?:       string;
  id?:         ID;
  picture?:    Picture;
  nat?:        Nat;
}

export interface Dob {
  date?: string;
  age?:  number;
}

export enum Gender {
  Female = "female",
  Male = "male",
}

export interface ID {
  name?:  NameEnum;
  value?: string;
}

export enum NameEnum {
  Nino = "NINO",
  Ssn = "SSN",
}

export interface Location {
  street?:      string;
  city?:        string;
  state?:       string;
  postcode?:    Postcode;
  coordinates?: Coordinates;
  timezone?:    Timezone;
}

export interface Coordinates {
  latitude?:  string;
  longitude?: string;
}

export type Postcode = number | string;

export interface Timezone {
  offset?:      string;
  description?: string;
}

export interface Login {
  uuid?:     string;
  username?: string;
  password?: string;
  salt?:     string;
  md5?:      string;
  sha1?:     string;
  sha256?:   string;
}

export interface NameClass {
  title?: Title;
  first?: string;
  last?:  string;
}

export enum Title {
  MS = "ms",
  Miss = "miss",
  Mr = "mr",
  Mrs = "mrs",
}

export enum Nat {
  GB = "GB",
  Us = "US",
}

export interface Picture {
  large?:     string;
  medium?:    string;
  thumbnail?: string;
}