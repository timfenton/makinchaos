import { cn } from '@/lib/utils';
import { buttonVariants } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from './label';
import React from 'react';

export interface Option {
    value: string;
    label: string;
}
  
interface MultiSelectPopoverProps {
    options: Option[];
    selected: string[];
    triggerText: string;
    disabledText?: string;
    onChange: (selected: string[]) => void;
    disabled?: boolean;
}

const MultiSelectPopover = ({ disabled, options, selected, triggerText, disabledText, onChange }: MultiSelectPopoverProps) => {
  return (
    <>
    <div className='flex flex-row gap-4'>
        <span className='font-bold text-xs'>Currently Selected: </span>
        <span className='text-xs'>{ selected && selected.length > 0 ? selected.join(', ') : 'No items currenty selected.'}</span>
    </div>
    <Popover modal>
      <PopoverTrigger 
        className={cn(buttonVariants({ size: 'sm' }), 'max-w-xs')}
        disabled={disabled}
      >
        {disabled ? disabledText : triggerText}
      </PopoverTrigger>
      <PopoverContent
        className="max-w-sm flex flex-col gap-2"
      >
        {options && options.length > 0 ? options.map((option) => (
          <div key={option.value} className="flex flex-row gap-2">
            <Checkbox
              checked={selected.includes(option.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...selected, option.value]);
                } else {
                  onChange(selected.filter((item) => item !== option.value));
                }
              }}
            />
            <Label className="flex items-center gap-2">
              {option.label}
            </Label>
          </div>
        )) : <span className='text-xs'>No tags available for the selected material type</span>
        }
      </PopoverContent>
    </Popover>
    </>
  );
};

export default MultiSelectPopover;
