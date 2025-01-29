import {
  createParser,
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server';
import { SortableFields } from './db/schema/materials';

const parseAsArrayOfString = createParser<string[]>({
  // `parse` is used to parse incoming data
  parse(value: string | string[] | undefined): string[] {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      return value.split(','); // Assuming values are comma-separated
    }
    return []; // Return an empty array if value is undefined
  },
  
  // `serialize` is used to serialize data before sending it to the client
  serialize(value: string[]): string {
    return value.join(','); // Join the array into a comma-separated string
  },
});

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  q: parseAsString,
  categories: parseAsString,
  tags: parseAsString,
  materialType: parseAsString,
  sort: parseAsStringEnum(Object.values(SortableFields)),
  dir: parseAsStringEnum(['asc', 'desc']),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
