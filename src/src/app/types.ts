export interface Mapping {
  [key: string]: string | null;
}

/** Interface that defines all the information about a mappable item. */
export interface MapItem {
  key: string;
  displayName: string;
}
