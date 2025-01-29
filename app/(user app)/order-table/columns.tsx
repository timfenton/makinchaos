'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { SelectFilament } from '@/lib/db/schema/filaments';

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
