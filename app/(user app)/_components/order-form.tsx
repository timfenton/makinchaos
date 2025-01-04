'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'; // Zod for schema validation
import { createProductSchema, NewProductExtended } from '@/lib/db/schema/products';
import { getFilaments, SelectFilament } from '@/lib/db/schema/filaments';
import { getfonts, SelectFont } from '@/lib/db/schema/fonts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Icon } from 'lucide-react';
import { Icons } from '@/components/icons';

const OrderForm = () => {
  const [products, setProducts] = useState<NewProductExtended[]>([]);
  const [filamentOptions, setFilamentOptions] = useState<SelectFilament[]>([]);
  const [fontOptions, setFontOptions] = useState<SelectFont[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProductFormVisible, setProductFormVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ name: '', address: '', phone: '' });

  // Fetch Filament and Font Options
  useEffect(() => {
    const fetchFilaments = async () => {
      try {
        setIsLoading(true);
        const data = await getFilaments();
        setFilamentOptions(data.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    const fetchFonts = async () => {
      try {
        setIsLoading(true);
        const data = await getfonts();
        setFontOptions(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchFilaments();
    fetchFonts();
  }, []);

  // Use React Hook Form
  const { control, handleSubmit, formState: { errors } } = useForm<NewProductExtended>({
    resolver: zodResolver(createProductSchema),
  });

  // Handle Product Form Submission
  const onSubmit: SubmitHandler<NewProductExtended> = (data) => {
    setProducts([...products, data]);
    setProductFormVisible(false);  // Hide the form after adding the product
  };

  // Handle Adding More Products
  const handleAddMore = () => {
    setProducts([...products, {
      description: '',
      price: '',
      qty: 1,
      size: '',
      petsName: '',
      filamentIds: [],
      fontIds: [],
    }]);
  };

  // Handle Final Order Submission
  const handleSubmitOrder = () => {
    console.log({ products, ...orderDetails });
    alert('Order submitted');
  };

  return (
    <div className="p-6 space-y-4">
      <Button disabled={isLoading} onClick={() => setProductFormVisible(true)} className="bg-blue-600 text-white py-2 px-4 rounded-md">
        Add Product
      </Button>

      {/* List of Added Products */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Products Added:</h2>
        {products.length === 0 ? (
          <p>No products added yet...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-black justify-between relative">
                <h3 className="text-lg font-bold !text-black">{product.description}</h3>
                <div className='relative'>
                  <p>Price: <span className="font-semibold">${product.price}</span></p>
                  <p>Quantity: <span className="font-semibold">{product.qty}</span></p>
                  <p>Size: <span className="font-semibold">{product.size}</span></p>
                  <p>{"Pet's Name:"} <span className="font-semibold">{product.petsName}</span></p>
                  <p>Font: <span className="font-semibold">{fontOptions.find((font) => product.fontIds[0] === font.id)?.name ?? "N/A"}</span></p>
                  <p>Filament: <span className="font-semibold">{filamentOptions.find((filament) => product.filamentIds[0] === filament.id)?.name ?? "N/A"}</span></p>
                </div>
                <Button className="sticky bottom-0 left-0" onClick={() => setProducts(products.filter((prod) => prod.id === product.id))}><Icons.trash /></Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show Product Form Dialog */}
      <Dialog open={isProductFormVisible} modal onOpenChange={(state) => setProductFormVisible(state)}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <Label>Description</Label>
                  <Input
                    {...field}
                    className="p-2 border rounded-md"
                    placeholder="Enter product description"
                    value={field.value ?? ''}
                  />
                  {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                </div>
              )}
            />

            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <Label>Price</Label>
                  <Input
                    {...field}
                    type="number"
                    className="p-2 border rounded-md"
                    placeholder="Enter price"
                    value={field.value ?? ''}
                  />
                  {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
                </div>
              )}
            />

            <Controller
              name="qty"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <Label>Quantity</Label>
                  <Input
                    {...field}
                    type="number"
                    className="p-2 border rounded-md"
                    placeholder="Enter quantity"
                    value={field.value ?? 1}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  {errors.qty && <p className="text-red-500 text-xs">{errors.qty.message}</p>}
                </div>
              )}
            />

            <Controller
              name="size"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <Label>Size</Label>
                  <Input
                    {...field}
                    className="p-2 border rounded-md"
                    placeholder="Enter size (optional)"
                    value={field.value ?? ''}
                  />
                </div>
              )}
            />

            <Controller
              name="petsName"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <Label>{"Pet's Name"}</Label>
                  <Input
                    {...field}
                    className="p-2 border rounded-md"
                    placeholder="Enter pet's name (optional)"
                    value={field.value ?? ''}
                  />
                </div>
              )}
            />

            {/* Filament and Font Selection */}
            <Controller
              name="filamentIds"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <Label>Filament</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select filament" />
                    </SelectTrigger>
                    <SelectContent>
                      {filamentOptions.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.filamentIds && <p className="text-red-500 text-xs">{errors.filamentIds.message}</p>}
                </div>
              )}
            />

            <Controller
              name="fontIds"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <Label>Font</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fontIds && <p className="text-red-500 text-xs">{errors.fontIds.message}</p>}
                </div>
              )}
            />

            {/* Buttons */}
            <div className="flex space-x-4 mt-4 justify-between">
              <Button onClick={handleSubmit(onSubmit)} className="bg-green-500 text-white py-2 px-4 rounded-md">
                Done
              </Button>
              <Button onClick={handleAddMore} className="bg-blue-500 text-white py-2 px-4 rounded-md">
                Add Another
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Level Details */}
      {products.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-black">Order Details</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <Label>Your Name</Label>
              <Input
                type="text"
                value={orderDetails.name}
                onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value })}
                className="p-2 border rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <Label>Street Address</Label>
              <Input
                type="text"
                value={orderDetails.address}
                onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
                className="p-2 border rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <Label>Phone Number</Label>
              <Input
                type="text"
                value={orderDetails.phone}
                onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
                className="p-2 border rounded-md"
              />
            </div>

            <div className="mt-4">
              <Button
                onClick={handleSubmitOrder}
                className="bg-purple-500 text-white py-2 px-4 rounded-md"
              >
                Submit Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
