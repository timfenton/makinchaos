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
import { Textarea } from '@/components/ui/textarea';
import { SelectMaterial } from '@/lib/db/schema/materials';

import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { handleMaterialSubmit } from '../actions';
import { FileUploader } from '@/components/file-uploader';
import { uploadFiles } from '@/lib/actions/upload';
import { MaterialType } from '@/lib/db/schema/materialTypes';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import MultiSelectPopover from '@/components/ui/multi-select';
import { Option } from '@/components/ui/multi-select';

interface MaterialProps {
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
  existingItem?: SelectMaterial;
  materialTypes?: MaterialType[];
}

interface FormValues {
  name: string;
  description: string;
  categories: string[];
  tags: string[];
  materialTypeId: number;
  buyUrl: string;
  stock: number;
  imageUrl: string;
}

const createOptions = (materialTypes: MaterialType[] | undefined, materialTypeId: number | undefined, column: keyof MaterialType): Option[] => {
  if (!materialTypes || materialTypeId === undefined) return [];

  const idAsNumber:number = parseInt(materialTypeId.toString());

  const selectedMaterialType = materialTypes.find(
    (type) => {
      return type.id === idAsNumber;
    }
  );

  if (selectedMaterialType && selectedMaterialType[column]) {
    return (selectedMaterialType[column] as string[]).map((cat) => ({
      label: cat,
      value: cat,
    }));
  }

  return [];
};

export default function NewEditMaterialDialog({ existingItem, openDialog, setOpenDialog, materialTypes }: MaterialProps): React.ReactElement {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: existingItem?.name || '',
      description: existingItem?.description || '',
      categories: existingItem?.categories || [],
      tags: existingItem?.tags || [],
      materialTypeId: existingItem?.materialTypeId || undefined,
      buyUrl: existingItem?.buyUrl || '',
      stock: existingItem?.stock || 0,
      imageUrl: existingItem?.imageUrl || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  });

  const materialTypeId = watch('materialTypeId');
  const [materialId, setMaterialId] = useState<number>();

  const categoryOptions: Option[] = useMemo(() => createOptions(materialTypes, materialTypeId, 'categories'), [materialTypeId, materialTypes]);
  const tagOptions: Option[] = useMemo(() => createOptions(materialTypes, materialTypeId, 'tags'), [materialTypeId, materialTypes]);

  const [continuousMode, setContinuousMode] = useState<boolean>(false);

  const materialTypeOptions = materialTypes || [];

  useEffect(() => {
    if (openDialog) {
      setMaterialId(existingItem?.id);
      setContinuousMode(false);
      reset({
        name: existingItem?.name || '',
        description: existingItem?.description || '',
        categories: existingItem?.categories || [],
        tags: existingItem?.tags || [],
        materialTypeId: existingItem?.materialTypeId || undefined,
        buyUrl: existingItem?.buyUrl || '',
        stock: existingItem?.stock || 0,
        imageUrl: existingItem?.imageUrl || '',
      });
    }
  }, [openDialog, existingItem, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await handleMaterialSubmit({
        ...data,
        id: materialId,
      });

      toast.success(`Successfully added ${data.name} to material library`)

      if(continuousMode)
      {
        reset({
          name: '',
          description: '',
          categories: [],
          tags: [],
          buyUrl: '',
          stock: 0,
          imageUrl: '',
        });
      } else {
        setOpenDialog(false);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error submitting form:', e);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog} >
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          ＋ Add new Material
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto pointer-events-auto">
        <DialogHeader>
          <DialogTitle>{!!existingItem ? "Update" : "Add New"} Material</DialogTitle>
          <DialogDescription>
            {!!existingItem ? "Updating" : "Adding a new"} material
          </DialogDescription>
        </DialogHeader>
        <form id="material-form" className="flex flex-col gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <Label>Material Image</Label>
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <FileUploader
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  maxFiles={1}
                  multiple={false}
                  maxSize={4 * 1024 * 1024}
                  onUpload={async (files) => {
                    const uploadUrls = await uploadFiles(files);
                    if (!uploadUrls || uploadUrls.length < 1) throw new Error('Failed to upload file.');

                    if (typeof uploadUrls === 'string') return uploadUrls;

                    const firstItem = uploadUrls[0];

                    return firstItem;
                  }}
                />
              )}
            />
            {errors.imageUrl && <span className="text-red-500 pl-2 text-sm">{errors.imageUrl.message}</span>}  
          </div>
          <div className="flex flex-col gap-4">
            <Label>Material Type</Label>
            <Controller
              name="materialTypeId"
              control={control}
              render={({ field }) => (
                <Select value={field.value?.toString()} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypeOptions.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.materialTypeId && <span className="text-red-500 pl-2 text-sm">{errors.materialTypeId.message}</span>}  
          </div>
          <div className="flex flex-col gap-4">
            <Label>Material Name</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Give the material a name..."
                  className="col-span-4"
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
              )}
            />
            {errors.name && <span className="text-red-500 pl-2 text-sm">{errors.name.message}</span>}
          </div>
          <div className="flex flex-col gap-4">
            <Label>Material Description / Notes</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Enter description..."
                  className="col-span-4"
                />
              )}
            />
            {errors.description && <span className="text-red-500 pl-2 text-sm">{errors.description.message}</span>}
          </div>
          <div className="flex flex-col gap-4">
            <Label>Material Buy URL</Label>
            <Controller
              name="buyUrl"
              control={control}
              rules={{
                validate: (value) =>
                  value.startsWith('http') || value === '' || 'Please enter a valid url',
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter the URL to buy the material"
                  className="flex-row"
                  value={field.value}
                />
              )}
            />
            {errors.buyUrl && <span className="text-red-500 pl-2 text-sm">{errors.buyUrl.message}</span>}
          </div>
          <div className="flex flex-col gap-4">
            <Label>Material Stock</Label>
            <Controller
                name="stock"
                control={control}
                rules={{
                  required: 'Stock is required',
                  validate: (value) =>
                    Number.isInteger(value) && value > 0 || 'Stock must be a valid number',
                }}
                render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Stock"
                  type="number"
                  min={0}
                  step={1}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(value);
                  }}
                />
              )} 
            />
            {errors.stock && <span className="text-red-500 pl-2 text-sm">{errors.stock.message}</span>}
          </div>
          <div className="flex flex-col gap-4">
            <Label>Material Categories</Label>
            <Controller
              name="categories"
              control={control}
              disabled={materialTypeId === undefined}
              render={({ field }) => (
                <MultiSelectPopover
                  {...field}
                  selected={field.value}
                  options={categoryOptions}
                  triggerText='Select Categories'
                  disabledText='Select a material type first.'
                  onChange={(selected) => {
                    field.onChange(selected);
                  }}
                />
              )}
            />
            {errors.categories && <span className="text-red-500 pl-2 text-sm">{errors.categories.message}</span>}
          </div>
          <div className="flex flex-col gap-4">
            <Label>Material Tags</Label>
            <Controller
              name="tags"
              control={control}
              disabled={materialTypeId === undefined}
              render={({ field }) => (
                <MultiSelectPopover
                  {...field}
                  selected={field.value}
                  options={tagOptions}
                  triggerText='Select Tags'
                  disabledText='Select a material type first.'
                  onChange={field.onChange}
                />
              )}
            />
            {errors.tags && <span className="text-red-500 pl-2 text-sm">{errors.tags.message}</span>}
          </div>
        </form>
        <DialogFooter className='flex flex-row gap-4'>
          <label className="flex items-center">
            <span className="text-xs mr-2">Continuous Mode</span>
            <Checkbox
              name="continuous"
              checked={continuousMode}
              onCheckedChange={(checked) => setContinuousMode(checked === true)}
            />
          </label>
          <DialogTrigger asChild>
            <Button type="submit" size="sm" form="material-form">
              {!!existingItem ? "Update" : "Add"} Material
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
