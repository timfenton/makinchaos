'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { updateMaterial } from '@/lib/db/schema/materials';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StockAdjuster from '@/app/admin/filament/_components/filament-tables/stock-adjuster';
import { SelectMaterial } from '@/lib/db/schema/materials';
import { MaterialType } from '@/lib/db/schema/materialTypes';
import ExpandableImage from '@/components/ui/expandable-image';
import { toast } from 'sonner';
import ActiveAction from './activeAction';
import { ArrowDownWideNarrowIcon, ArrowUpWideNarrowIcon } from 'lucide-react';

interface GetColumnsProps {
  updateItemAction: (row: SelectMaterial) => void;
  triggerRefresh: () => void;
  materialTypes?: MaterialType[];
}

export const getColumns = ({ updateItemAction, triggerRefresh, materialTypes }: GetColumnsProps): ColumnDef<SelectMaterial>[] => {
  

  const onConfirm = async (row: SelectMaterial) => {
    await updateMaterial(row.id, { ...row, isActive: !row.isActive });
    toast.success(`Successfully updated ${row.name}.`)
    setTimeout(() => {
      triggerRefresh();
    }, 500);
  };
  
  const getMaterialTypeName = (materialTypeId: number) => {
    if(!materialTypes) return 'unknown';

    const materialType = materialTypes.find((mt) => mt.id === materialTypeId);

    return materialType?.name ?? 'unknown';
  };

  const updateMaterialStock = async (id: number, stockUpdate: number) => {
    await updateMaterial(id, { stock: stockUpdate });
  }

  return [{
    accessorKey: 'imageUrl',
    header: 'IMAGE',
    cell: ({ row }) => {
      const imageUrl  = row.getValue('imageUrl') as string;
      return (
        <div className="relative aspect-square">
          { imageUrl && imageUrl.startsWith('http') && (
            <ExpandableImage 
                  imageUrl={row.getValue('imageUrl')}
                  altText={row.getValue('name')}
                  sizes='120px'
                />
          )}
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
    header: ({ column }) => {
      return (<Button
        className='flex flex-row gap-5 items-start justify-between'
        variant="ghost"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === 'asc');
        }}
      >
        STOCK
        {column.getIsSorted() === 'asc' ? <ArrowUpWideNarrowIcon /> : column.getIsSorted() === 'desc' ? <ArrowDownWideNarrowIcon /> : ''}
      </Button>);
    },
    sortingFn: 'alphanumeric',
    cell: ({ row }) => <StockAdjuster row={row} onStockChange={updateMaterialStock} /> 
  },
  {
    accessorKey: 'categories',
    header: 'CATEGORY',
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
    accessorKey: 'buyUrl',
    header: 'BUY URL',
    cell: ({ row }) => {
      const buyUrl = row.getValue('buyUrl') as string;
      const buyUrlActive = !!buyUrl && buyUrl.startsWith('http');
      return (
        <Button disabled={!buyUrlActive} asChild className='py-6 px-2 w-24'>
          <Link href={buyUrl} target='_blank'>Buy Now</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: 'materialTypeId',
    header: "MATERIAL TYPE",
    cell: ({row}) => {
      return getMaterialTypeName(row.original.materialTypeId);
    },
  },
  {
    accessorKey: 'isActive',
    header: 'ACTIVE',
    cell: ({ row }) => {
      return <ActiveAction row={row.original} onConfirm={() => onConfirm(row.original)} />;
    },
  },
  {
    accessorKey: 'created',
    enableSorting: true,
    sortingFn: 'datetime',
    header: ({ column }) => {
      return (<Button
        className='flex flex-row gap-5 items-start w-full justify-between'
        variant="ghost"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === 'asc');
        }}
      >
        CREATED
        {column.getIsSorted() === 'asc' ? <ArrowUpWideNarrowIcon /> : column.getIsSorted() === 'desc' ? <ArrowDownWideNarrowIcon /> : ''}
      </Button>);
    },
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue('created') as string);
      return createdAt.toLocaleString();
    },
  },
  {
    accessorKey: 'modified',
    enableSorting: true,
    sortingFn: 'datetime',
    header: ({ column }) => {
      return (<Button
        className='flex flex-row gap-5 items-start w-full justify-between'
        variant="ghost"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === 'asc');
        }}
      >
        MODIFIED
        {column.getIsSorted() === 'asc' ? <ArrowUpWideNarrowIcon /> : column.getIsSorted() === 'desc' ? <ArrowDownWideNarrowIcon /> : ''}
      </Button>);
    },
    cell: ({ row }) => {
      const modified = new Date(row.getValue('modified') as string);
      return modified.toLocaleString();
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
    return (
    <>
      
      <CellAction data={row.original} updateItemAction={() => updateItemAction(row.original)} triggerRefresh={triggerRefresh} /></>
    )}
  }
]};
