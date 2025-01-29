import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { DialogTitle } from '@radix-ui/react-dialog';

interface ExpandableImageProps {
  imageUrl: string;
  altText: string;
  sizes?: string;
}

const ExpandableImage = ({ imageUrl, altText, sizes = "120px" }: ExpandableImageProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="relative aspect-square cursor-pointer">
            <Image
              src={imageUrl}
              alt={altText}
              sizes={sizes}
              fill
              className="rounded-lg"
            />
          </div>
        </DialogTrigger>

        <DialogContent
          className="p-6 rounded-lg shadow-lg max-w-xl"
          onClick={() => setOpen(false)} 
        >
            <DialogTitle>{altText} Image</DialogTitle>
          <div className="flex justify-center items-center">
            <Image
              src={imageUrl}
              alt={altText}
              width={800} 
              height={800}
              className="rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpandableImage;
