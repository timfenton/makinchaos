import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server';
import { SortableFields } from './db/schema/materials';

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
