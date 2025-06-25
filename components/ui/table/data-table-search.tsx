'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Options } from 'nuqs';
import { useEffect, useState, useTransition } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

interface DataTableSearchProps {
  searchKey: string;
  searchQuery: string;
  setSearchQuery: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  setPage: (
    value: number | ((old: number) => number | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
}

export function DataTableSearch({
  searchKey,
  searchQuery,
  setSearchQuery,
  setPage
}: DataTableSearchProps) {
  const [isLoading, startTransition] = useTransition();

  const [value, setValue] = useState<string | null>(searchQuery ?? '');

  const debouncedValue = useDebounce(value, 300); // Debounce search input for 300ms

  useEffect(() => {
    setSearchQuery(debouncedValue, {startTransition});
    setPage(1); // Reset page to 1 when search changes
  }, [debouncedValue, setPage, setSearchQuery]);

  const handleSearch = (value: string) => {
    setValue(value);
  };

  return (
    <Input
      placeholder={`Search ${searchKey}...`}
      value={value ?? ''}
      onChange={(e) => handleSearch(e.target.value)}
      className={cn('w-full md:max-w-sm', isLoading && 'animate-pulse')}
    />
  );
}
