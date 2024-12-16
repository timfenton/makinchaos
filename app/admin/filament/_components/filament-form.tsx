'use client';

import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createFilamentSchema, FilamentCategories, insertFilament, SelectFilament, updateFilament } from '@/lib/db/schema/filaments';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { uploadFiles } from '@/lib/actions/upload';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function FilamentForm({
  initialData,
  pageTitle
}: {
  initialData: SelectFilament | null;
  pageTitle: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const router = useRouter();

  const defaultValues = {
    name: initialData?.name || '',
    category: initialData?.category || FilamentCategories.GLITTER,
    buyUrl: initialData?.buyUrl || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    tags: initialData?.tags || [],
    stock: initialData?.stock || 0,
  };

  const form = useForm<z.infer<typeof createFilamentSchema>>({
    resolver: zodResolver(createFilamentSchema),
    values: defaultValues,
    mode: 'onBlur'
  });

  async function onSubmit(values: z.infer<typeof createFilamentSchema>) {
    try {
      const result = initialData && initialData?.id ? await updateFilament(initialData?.id, values) : await insertFilament(values);

      if (result) {
        const successMessage = `Successfully ${initialData ? `updated ${values.name}.` : `added ${values.name} to filaments.`}`;
        toast.success(successMessage);
        setTimeout(() => !continuousMode || initialData ? router.push('/admin/filament') : form.reset(defaultValues), 1000);
      } else {
        toast.error('Something went wrong while submitting the form!');
      }
    } catch (e) {
      const error = e as Error;
      form.setError('root', { message: error.message, type: 'value' });
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
      <div className="flex justify-end justify-items-end items-end space-x-2 w-full">
        <Checkbox id="continuous" 
          checked={continuousMode}
          onCheckedChange={(state: boolean) => setContinuousMode(state)} />
        <label
          htmlFor="continuous"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Continuous Mode
        </label>
      </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <div className="space-y-6">
                <FormItem className="w-full">
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value ? (Array.isArray(field.value) ? field.value : [field.value]) : []}
                      onValueChange={(values) => {
                        const uploadedUrl = Array.isArray(values) ? values[0] : (values || '');
                        field.onChange(uploadedUrl);
                      }}
                      multiple={false}
                      maxSize={4 * 1024 * 1024}
                      disabled={isLoading}
                      onUpload={uploadFiles}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select categories" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(FilamentCategories).map((item) =>
                          <SelectItem key={item[1]} value={item[1]}>
                            {item[0].replace('_', ' ')}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="buyUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buy Url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the URL to buy the filament"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Any tags to make filtering / finding easier (comma-seperated)"
                        {...field}
                        value={field.value?.join(', ') ?? ''}
                        onChange={(event) => { 
                          const trimmedValue = event.target.value.trim();
                          const stringArray = trimmedValue ? 
                            trimmedValue.split(',')
                              .map((tag) => tag.trim()) 
                            : [];

                          field.onChange(stringArray);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Url to buy"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(parseInt(value, 10));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{!initialData ? "Add" : "Update"} Product</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
