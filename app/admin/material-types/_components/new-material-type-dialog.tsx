'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { InputTags } from '@/components/ui/input-tags';
import { Textarea } from '@/components/ui/textarea';
import { MaterialType } from '@/lib/db/schema/materialTypes';

import { SetStateAction, useEffect, useState } from 'react';
import { handleMaterialTypeSubmit } from '../actions';

interface MaterialTypeProps {
  openDialog: boolean;
  setOpenDialog: (value: SetStateAction<boolean>) => void;
  existingItem?: MaterialType;
}

export default function NewEditMaterialTypeDialog({ existingItem, openDialog, setOpenDialog }: MaterialTypeProps): React.ReactElement {
  
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [id, setId] = useState<number | undefined>();
  const [errors,] = useState<Error[]>([]);

  useEffect(() => {
    if(openDialog)
    {
      if(existingItem?.tags)
        setTags(existingItem.tags);

      if(existingItem?.categories)
        setCategories(existingItem.categories);

      if(existingItem?.id)
        setId(existingItem.id);
      else {
        setId(undefined);
      }
    }
  }, [openDialog, existingItem]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          ＋ Add new Material Type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{!!existingItem ? "Update" : "Add New"} Material Type</DialogTitle>
          <DialogDescription>
            {!!existingItem ? "Updating" : "Adding a new"} material type to be used to maange materials
          </DialogDescription>
        </DialogHeader>
        <form
          id="material-form"
          className="grid gap-4 py-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);

            const name = formData.get('name') as string;
            const description = formData.get('description') as string;

            const combinedData = { name, description, categories, tags, id }

            try{
              await handleMaterialTypeSubmit(combinedData);
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(e);
            }
          }}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              name="name"
              placeholder="Give the material a name..."
              className="col-span-4"
              defaultValue={existingItem?.name ?? ''}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Textarea
              id="description"
              name="description"
              placeholder="Enter description..."
              className="col-span-4"
              defaultValue={existingItem?.description ?? ''}
            />
          </div>
          <div className="grid items-center gap-4">
            <InputTags 
              id="categories" 
              name="categories" 
              placeholder='Enter categories...'
              value={categories} 
              onChange={setCategories} />
          </div>
          <div className="grid items-center gap-4">
            <InputTags 
              id="tags" 
              name="tags" 
              placeholder='Enter tags...' 
              className='col-span-4' 
              value={tags} 
              onChange={setTags} />
          </div>
        </form>
        <DialogFooter>
          { errors && errors.length > 0 && <span className='text-red-500'>{ errors.join('<br />') }</span> }
          <DialogTrigger asChild>
            <Button type="submit" size="sm" form="material-form">
              {!!existingItem ? "Update" : "Add"} Material Type
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
