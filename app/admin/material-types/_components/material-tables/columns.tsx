'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Badge } from '@/components/ui/badge';
import { MaterialType } from '@/lib/db/schema/materialTypes';

interface GetColumnsParams {
  updateItemAction: (row: MaterialType) => void;
  triggerRefresh: () => void;
}

export const getColumns = ({ updateItemAction, triggerRefresh }: GetColumnsParams): ColumnDef<MaterialType>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    enableSorting: true,
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPTION',
  },
  {
    accessorKey: 'categories',
    header: 'CATEGORIES',
    cell: ({ row }) => {
      const categories = row.getValue('categories') as string[];
      return (
        <div className='flex flex-row gap-2'>
          {categories.map((category) => <Badge key={category} className="px-2">{category}</Badge>)}
        </div>
      );
    },
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
    id: 'actions',
    cell: ({ row }) => <CellAction updateItemAction={() => updateItemAction(row.original)} data={row.original} triggerRefresh={triggerRefresh} />
  }
];
