"use client"

import React from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getMaterials, MaterialFilters, MaterialWithTypes } from '@/lib/db/schema/materials';

const PatternGallery = () => {
  const [patterns, setPatterns] = React.useState<MaterialWithTypes[]>();

  React.useEffect(() => {
    async function grabPatterns() {
      const filter: MaterialFilters | undefined = {};
      // materialType '17' is for patterns
      filter.materialType = '17';

      const response = await getMaterials(filter);
      console.log('Fetched patterns:', response);
      if (response.data) setPatterns(response.data);
    }

    grabPatterns();
  }, []);

  const handleCopyId = (id: string | number) => {
    navigator.clipboard
      .writeText(String(id))
      .then(() => {
        toast(`Copied ID "${id}" to clipboard!`);
      })
      .catch(() => {
        toast(`Failed to copy ID: ${id}`);
      });
  };

  return (
    <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
      {patterns &&
        patterns.map(({ materials }) => (
          <div
            key={materials.id}
            className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div
              className="w-full aspect-[1/1] relative cursor-pointer"
              onClick={() => handleCopyId(materials.id)}
            >
              {materials.imageUrl && (
                <Image
                  src={materials.imageUrl}
                  alt={materials.id.toString()}
                  className="transition-transform group-hover:scale-110 duration-500"
                  style={{ objectFit: 'cover' }}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              ID: {materials.id}
            </div>
          </div>
        ))}
    </div>
  );
};

export default PatternGallery;
