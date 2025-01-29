'use client'

import { DataTable as MaterialTable } from '@/components/ui/table/data-table';
import { getColumns } from './material-tables/columns';
import { getMaterials, MaterialFilters, MaterialWithTypes, SelectMaterial, SortBy } from '@/lib/db/schema/materials';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import MaterialTableAction from './material-tables/material-table-action';
import { useCallback, useEffect, useState } from 'react';
import NewEditMaterialDialog from './new-material-dialog';
import { MaterialType } from '@/lib/db/schema/materialTypes';
import { useMaterialTableFilters } from './material-tables/use-material-table-filters';

type MaterialListing = {
  data: MaterialWithTypes[];
  filters: MaterialFilters,
  sortBy?: SortBy,
  materialTypes?: MaterialType[],
};

export default function MaterialListing({ data, filters: initialFilters, sortBy, materialTypes }: MaterialListing) {
  const [materials, setMaterials] = useState<MaterialWithTypes[]>(data);
  const [openDialog, setOpenDialog] = useState(false);
  const [updateItem, setUpdateItem] = useState<SelectMaterial | undefined>();
  const {tagsFilter: tags, categoriesFilter: categories, materialTypesFilter: materialType, searchQuery: search} = useMaterialTableFilters();
  
  const refreshMaterials = useCallback(async () => {
    const response = await getMaterials({
      tags,
      categories,
      materialType,
      search
    }, sortBy, true);
    
    setMaterials(response.data);
  }, [tags, categories, materialType, search])

  useEffect(() => {
    refreshMaterials();
  }, [tags, categories, materialType, search]);
  
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
  }, [openDialog]);

  return (
    <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Materials"
            description="Manage materials"
          />
          <NewEditMaterialDialog openDialog={openDialog} setOpenDialog={setOpenDialog} existingItem={updateItem} materialTypes={materialTypes} />
        </div>
        <Separator />
        <MaterialTableAction materialTypes={materialTypes} />
          <MaterialTable
            columns={getColumns({updateItemAction: (row) => setUpdateItem(row), triggerRefresh: refreshMaterials, materialTypes: materialTypes})}
            data={materials.map((mat) => mat.materials)}
            totalItems={materials.length}
          />
      </div>
  );
}
