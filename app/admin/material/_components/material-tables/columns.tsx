'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { updateMaterial } from '@/lib/db/schema/materials';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCallback, useState } from 'react';
import StockAdjuster from '@/app/admin/filament/_components/filament-tables/stock-adjuster';
import { SelectMaterial } from '@/lib/db/schema/materials';
import { MaterialType } from '@/lib/db/schema/materialTypes';
import ExpandableImage from '@/components/ui/expandable-image';
import { AlertModal } from '@/components/modal/alert-modal';
import { toast } from 'sonner';

interface GetColumnsProps {
  updateItemAction: (row: SelectMaterial) => void;
  triggerRefresh: () => void;
  materialTypes?: MaterialType[];
}

export const getColumns = ({ updateItemAction, triggerRefresh, materialTypes }: GetColumnsProps): ColumnDef<SelectMaterial>[] => {
  const [open, setOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<SelectMaterial | undefined>();
  const [loading, setLoading] = useState(false);

  const onConfirm = async (row: SelectMaterial) => {
    setLoading(true);
    await updateMaterial(row.id, { ...row, isActive: !row.isActive });
    setLoading(false);
    setOpen(false);
    toast.success(`Successfully updated ${row.name}.`)
    setTimeout(() => {
      triggerRefresh();
    }, 500);
  };
  
  const getMaterialTypeName = useCallback((materialTypeId: number) => {
    if(!materialTypes) return 'unknown';

    const materialType = materialTypes.find((mt) => mt.id === materialTypeId);

    return materialType?.name ?? 'unknown';
  }, [materialTypes])

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
    header: 'STOCK',
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
      const isActive = row.getValue('isActive') as boolean;
      return <Badge onClick={() => {setActiveRow(row.original); setOpen(true);}} className={`${isActive ? "bg-green-500" : "bg-red-500"} cursor-pointer`}>{isActive ? "Active" : "Inactive"}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
    return (
    <>
      <AlertModal
          description={`This will ${activeRow?.isActive ? 'deactivate' : 'activate'} ${activeRow?.name}.`}
          variant="default"
          isOpen={open}
          onClose={() => {
            setOpen(false);
          } }
          onConfirm={() => onConfirm(activeRow as SelectMaterial)} 
          loading={loading} />
      <CellAction data={row.original} updateItemAction={() => updateItemAction(row.original)} triggerRefresh={triggerRefresh} /></>
    )}
  }
]};
