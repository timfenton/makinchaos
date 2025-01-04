'use client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { incrementFilamentStock, SelectFilament, updateFilament } from '@/lib/db/schema/filaments';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { searchParamsCache } from '@/lib/searchparams';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import StockAdjuster from '@/app/admin/filament/_components/filament-tables/stock-adjuster';

export const columns: ColumnDef<SelectFilament>[] = [
  {
    accessorKey: 'qty',
    header: 'Qty',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'price',
    header: 'Price per item',
  },
  {
    accessorKey: 'size',
    header: 'Size',
  },
  {
    accessorKey: 'petsName',
    header: 'Name of Pet',
  },
  {
    accessorKey: 'filaments',
    header: 'Filaments',
    cell({ row }) {
        return (
          row.getValue('')
        );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
