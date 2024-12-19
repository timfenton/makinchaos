'use client'

import React from 'react';
import Image from 'next/image';
import { getFilaments, SelectFilament } from '@/lib/db/schema/filaments';
import { toast } from 'sonner';

const FilamentGallery = () => {
    const [filaments, setFilaments] = React.useState<SelectFilament[] | undefined>(undefined);

    React.useEffect(() => {
        async function grabFilaments () {
            const response = await getFilaments();
    
            if(response.data)
                setFilaments(response.data);
        }

        grabFilaments();
    });
    

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
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
    );
  };
  
  export default FilamentGallery;
  