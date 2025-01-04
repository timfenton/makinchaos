'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateFilament } from "@/lib/db/schema/filaments";
import { useState, useEffect } from "react";

export default function StockAdjuster ({row}: {row: { original: { id: number, stock: number }}}) {
    const id = row.original.id;

      const [stockState, setStockState] = useState<number>(row.original.stock);

      useEffect(() => {
        setStockState(row.original.stock);
      }, [row.original.stock]);

      const handleIncrement = async (amount: number) => {
        setStockState(prev => prev + amount);
        await updateFilament(id, { stock: stockState + amount });
      };

      const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setStockState(newValue);
        await updateFilament(id, { stock: newValue });
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