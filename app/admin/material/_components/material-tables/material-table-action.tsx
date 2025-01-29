'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  useMaterialTableFilters
} from './use-material-table-filters';
import { MaterialType } from '@/lib/db/schema/materialTypes';
import { useMemo } from 'react';

interface MaterialTableActionProps {
  materialTypes?: MaterialType[];
}

export default function MaterialTableAction({materialTypes}: MaterialTableActionProps) {
  const {
    categoriesFilter,
    setCategoriesFilter,
    materialTypesFilter,
    setMaterialTypeFilter,
    tagsFilter,
    setTagsFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useMaterialTableFilters();

  const selectedMaterialType = materialTypesFilter && materialTypes ? materialTypes.find((mt) => {
    mt.id
  }) : undefined;

  const availableCategoriesAndTags = useMemo(() => {
    if(!materialTypes) return {
      categories: [],
      tags: [],
    };
    if (selectedMaterialType && selectedMaterialType.categories) {
      return {
        categories: selectedMaterialType.categories,
        tags: selectedMaterialType.tags,
      };
    }
  
    const result = materialTypes.reduce(
      (acc, curr) => {
        const newCategories = new Set(curr.categories);
        const newTags = new Set(curr.tags);
  
        return {
          categories: new Set([...acc.categories, ...newCategories]),
          tags: new Set([...acc.tags, ...newTags]),
        };
      },
      { categories: new Set<string>(), tags: new Set<string>() } // Initial accumulator
    );
    
    return {
      categories: Array.from(result.categories),
      tags: Array.from(result.tags),
    };
  }, [selectedMaterialType, materialTypes]);
  

  const availableMaterialTypes = materialTypes ? materialTypes.map((mt) => {
    return {
      value: mt.id.toString(),
      label: mt.name,
    }
  }) : [];


  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      {materialTypes && <DataTableFilterBox
        filterKey="materialType"
        title="Material Type"
        options={availableMaterialTypes}
        setFilterValue={setMaterialTypeFilter}
        filterValue={materialTypesFilter}
      />
      } 
      {availableCategoriesAndTags.categories && <DataTableFilterBox
        filterKey="categories"
        title="Categories"
        options={
          availableCategoriesAndTags.categories.map((ac) => {
            return {
              value: ac,
              label: ac,
            }
          })
        }
        setFilterValue={setCategoriesFilter}
        filterValue={categoriesFilter}
      />
      }
      { availableCategoriesAndTags.tags && <DataTableFilterBox
        filterKey="tags"
        title="Tags"
        options={
          availableCategoriesAndTags.tags.map((ac) => {
            return {
              value: ac,
              label: ac,
            }
          })
        }
        setFilterValue={setTagsFilter}
        filterValue={tagsFilter}
      />
      }
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
