'use client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { SelectFilament } from '@/lib/db/schema/filaments';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<SelectFilament>[] = [
  {
    accessorKey: 'imageUrl',
    header: 'IMAGE',
    cell: ({ row }) => {
      return (
        <div className="relative aspect-square">
          <Image
            src={row.getValue('imageUrl')}
            alt={row.getValue('name')}
            fill
            className="rounded-lg"
          />
        </div>
      );
    }
  },
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'stock',
    header: 'STOCK'
  },
  {
    accessorFn: ((row) => {
      return row.category.replaceAll('_', ' ').toUpperCase();
    }),
    header: 'CATEGORY'
  },
  {
    accessorKey: 'tags',
    header: 'TAGS'
  },
  {
    accessorKey: 'buyUrl',
    header: 'BUY URL',
    cell: ({ row }) => {
      return (
        <Button asChild>
          <Link href={row.getValue('buyUrl')} target='_blank'>Buy Now</Link>
        </Button>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
