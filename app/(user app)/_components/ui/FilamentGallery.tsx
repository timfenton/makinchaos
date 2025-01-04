'use client'

import React from 'react';
import Image from 'next/image';
import { FilamentCategories, getFilaments, SelectFilament, FilamentFilters } from '@/lib/db/schema/filaments';
import { toast } from 'sonner';
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const FilamentGallery = () => {
    const [filaments, setFilaments] = React.useState<SelectFilament[]>();
    const [categoryFilter, setCategoryFilter] = React.useState<FilamentCategories>();
    const [categoryFilterKey, setCategoryFilterKey] = React.useState(+new Date())

    React.useEffect(() => {
        async function grabFilaments () {

            const filter: FilamentFilters | undefined = categoryFilter ? {
              categories: categoryFilter,
            } : undefined;

            const response = await getFilaments(filter);
    
            if(response.data)
                setFilaments(response.data);
        }

        grabFilaments();
    },[categoryFilter]);

    const filamentCategorySelects = Object.entries(FilamentCategories).map(([v, k]) => {
      console.log(k, v);
      return (<SelectItem key={k} value={k}>{v.replace("_"," ")}</SelectItem>)
    })
    

    const handleCopyToClipboard = (name: string) => {
        navigator.clipboard.writeText(name)
          .then(() => {
            toast(`Copied "${name}" to clipboard!`);
          })
          .catch((err) => {
            toast(`Failed to copy text: ${name}`, {});
          });
      };

    return (
      <>
      <div className='mb-10 flex flex-col space-y-5 z-50 max-w-md'>
        <Label>
          Filament Category Filter
        </Label>
        <div className='flex flex-row max-w-md space-x-4'>
          <Select key={categoryFilterKey} value={categoryFilter} onValueChange={(value) => value ? setCategoryFilter(value as FilamentCategories) : undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent onCloseAutoFocus={(e) => e.preventDefault()} position='popper'>
                {filamentCategorySelects}
              </SelectContent>
          </Select>
          <Button type='reset' variant={'outline'} onClick={() => {
            setCategoryFilter(undefined); setCategoryFilterKey(+new Date)
          }}>Reset</Button>
        </div>
      </div>
      <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
        {filaments && 
            filaments.map((filament) => (
          <div
            key={filament.id}
            className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div className="w-full aspect-[1/1] relative" onClick={() => handleCopyToClipboard(filament.name)}>
              <Image
                src={filament.imageUrl}
                alt={filament.name}
                className="transition-transform group-hover:scale-110 duration-500"
                style={{
                  objectFit: 'cover', 
                }}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
  
            {/* Filament Name */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {filament.name}
            </div>
          </div>
        ))}
      </div>
      </>
    );
  };
  
  export default FilamentGallery;
  