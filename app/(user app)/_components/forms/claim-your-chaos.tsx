'use client';

import { Button } from '@/components/ui/button';
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
import { getFilaments, type SelectFilament } from '@/lib/db/schema/filaments';
import { getfonts, SelectFont } from '@/lib/db/schema/fonts';
import { createProductSchema } from '@/lib/db/schema/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export default function ClaimYourChaos() {
  const [filamentOptions, setFilamentOptions] = useState<SelectFilament[]>([]);
  const [fontOptions, setFontOptions] = useState<SelectFont[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setError] = useState<Error | null>(null);


  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    mode: 'onBlur',
  });

  function onSubmit(values: z.infer<typeof createProductSchema>) {
    // eslint-disable-next-line no-console
    console.log(values);
  }

  useEffect(() => {
    const fetchFilaments = async () => {
      try {
        const data = await getFilaments(); 
        setFilamentOptions(data.data); 
        setLoading(false);
      } catch (err) {
        setError(err as Error); 
        setLoading(false); 
      }
    };

    const fetchFonts = async () => {
      try {
        setLoading(true);
        const data = await getfonts();
        setFontOptions(data);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    fetchFilaments();
    fetchFonts();
  }, []);

  if (loading) return <>Loading...</>

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a description for the item (ex. Feeder Box)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {filamentOptions && filamentOptions.length > 0 && <FormField
            control={form.control}
            name="filamentIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color (If Applicable)</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className='w-[280px]'>
                    <SelectValue placeholder="Select color(s)" />
                  </SelectTrigger>
                  <SelectContent className='max-h-[300px]'>
                    { filamentOptions.map((item) => {
                      return <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                    }) }
                  </SelectContent>
                </Select>
                <FormMessage />
                <p className='text-xs pt-2 italic font-extralight text-gray-500'>
                  *Note: Usually only one color per product, unless otherwise mentioned
                </p>
              </FormItem>
              )}
            />
          }
          {fontOptions && fontOptions.length > 0 && <FormField
            control={form.control}
            name="fontIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font (If Applicable)</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    { fontOptions.map((item) => {
                      return <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                    }) }
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          }
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <Input placeholder="Enter size (ex. Large or 8x10)"
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
            name="qty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    placeholder="Enter how many of these you want"
                    {...field}
                    value={field.value ?? 1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={!!errors}>Add Item</Button>
      </form>
    </Form>
    <Button className='mt-3' type="button">Claim</Button>
    </>
  );
}

    {/* <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <div className="space-y-6">
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    maxFiles={4}
                    maxSize={4 * 1024 * 1024}
                    // disabled={loading}
                    // progresses={progresses}
                    // pass the onUpload function here for direct upload
                    // onUpload={uploadFiles}
                    // disabled={isUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        /> */}