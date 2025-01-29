'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from 'react-use';
import { toast } from "sonner";

interface StockAdjusterProps {
  row: { original: { id: number, name: string, stock: number } },
  onStockChange: (id:number, stock: number) => Promise<void>,
}

export default function StockAdjuster ({ row, onStockChange}: StockAdjusterProps) {
      const { id, name }= row.original;

      const [stockState, setStockState] = useState<number>(row.original.stock);

      const firstLoad = useRef(true);
      
      useDebounce(async () => {
        if(firstLoad.current) {
          firstLoad.current = false;
          return;
        }
        await onStockChange(id, stockState);
        toast.success(`Finished updating stock for ${name} to ${stockState}`);
      }, 500, [stockState]);

      useEffect(() => {
        setStockState(row.original.stock);
      }, [row.original.stock]);

      const handleIncrement = async (amount: number) => {
        setStockState(prev => prev + amount);
      };

      const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setStockState(newValue);
      };

      return (
        <div className='flex flex-row h-14 gap-2'>
          <Button variant="outline" onClick={() => handleIncrement(-1)} className="px-5 h-full text-xl">
            -
          </Button>
          <Input
            type="number"
            inputMode="numeric"
            value={stockState}
            onChange={handleChange}
            className="w-16 h-full text-center no-spinner"
          />
          <Button variant="outline" onClick={() => handleIncrement(1)} className="px-5 h-full text-xl">
            +
          </Button>
        </div>
      )
}