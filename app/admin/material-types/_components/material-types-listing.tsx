'use client'

import { DataTable as MaterialTypeTable } from '@/components/ui/table/data-table';
import { getColumns } from './material-tables/columns';
import { getMaterialTypes, MaterialType } from '@/lib/db/schema/materialTypes';
import { Separator } from '@radix-ui/react-dropdown-menu';
import NewEditMaterialTypeDialog from './new-material-type-dialog';
import { Heading } from '@/components/ui/heading';
import { useCallback, useEffect, useState } from 'react';

interface MaterialTypeListingProps {
  data: MaterialType[]
}

const MaterialTypeListing: React.FC<MaterialTypeListingProps> = ({ data }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [updateItem, setUpdateItem] = useState<MaterialType | undefined>();
  const [materialTypeList, setMaterialTypeList] = useState<MaterialType[]>(data);

  const refreshMaterials = useCallback(async () => {
    const materialTypes = await getMaterialTypes();
    setMaterialTypeList(materialTypes);
  }, [])

  useEffect(() => {
    if(updateItem){
      setOpenDialog(true);
    }
  }, [updateItem])

  useEffect(() => {
    if(!openDialog){
      setUpdateItem(undefined);
      setTimeout(() => refreshMaterials(), 500);
    }
  }, [openDialog, refreshMaterials]);

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between">
            <Heading
                title="Material Types"
                description="Manage material types, their tags and categories"
            />
            <NewEditMaterialTypeDialog openDialog={openDialog} setOpenDialog={setOpenDialog} existingItem={updateItem} />
            </div>
            <Separator />
            <MaterialTypeTable
              columns={getColumns({updateItemAction: (row) => setUpdateItem(row), triggerRefresh: refreshMaterials})}
              data={materialTypeList}
              totalItems={materialTypeList.length}
            />
        </div>
    );
}

export default MaterialTypeListing;