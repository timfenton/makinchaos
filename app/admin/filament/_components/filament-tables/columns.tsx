'use client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { SelectFilament } from '@/lib/db/schema/filaments';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StockAdjuster from '@/app/admin/filament/_components/filament-tables/stock-adjuster';

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
            sizes='120px'
            fill
            className="rounded-lg"
          />
        </div>
      );
    }
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    enableSorting: true,
  },
  {
    accessorKey: 'stock',
    header: 'STOCK',
    cell: ({ row }) => <StockAdjuster row={row} onStockChange={(id, stock) => Promise.resolve()} /> 
  },
  {
    accessorFn: ((row) => {
      return row.category.replaceAll('_', ' ').toUpperCase();
    }),
    header: 'CATEGORY'
  },
  {
    accessorKey: 'tags',
    header: 'TAGS',
    cell: ({ row }) => {
      const tags = row.getValue('tags') as string[];
      return (
        <div className='flex flex-row gap-2'>
          {tags.map((tag) => <Badge key={tag} className="px-2">{tag}</Badge>)}
        </div>
      );
    },
  },
  {
    accessorKey: 'buyUrl',
    header: 'BUY URL',
    cell: ({ row }) => {
      return (
        <Button asChild className='py-6 px-2 w-24'>
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
