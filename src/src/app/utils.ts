import { toPairs, xor, keys, values } from 'lodash';

import { Mapping, MapItem } from './types';

/**
 * Returns an array of available keys.
 *
 * @param mapping Object of key-value pairs.
 */
export function getAvailableKeys(mapping: Mapping): string[] {
  return xor(keys(mapping), values(mapping)).filter(v => !!v);
}

/**
 * Returns an object representing an item that can be mapped.
 *
 * @param key The string key used by the backend to represent an item, eg. "Item1".
 */
export function toMapItem(key: string): MapItem {
  return { key, displayName: key }; // Can make display name different than the key.
}
