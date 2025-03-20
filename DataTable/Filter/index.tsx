import { cn } from '@/app/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useFilterQueue } from '@/zustand-store/idr/filter-store';
import { CheckIcon } from '@heroicons/react/24/outline';
import { PropsType } from './props';
import useTranslations from './translations';

export function DataTableFilter({ title, options, icon, selectedValues, onChange }: PropsType) {
  const t = useTranslations();
  const { filters } = useFilterQueue();

  const handleOptionSelect = (option: string) => {
    if (Array.isArray(selectedValues)) {
      const updatedValues = selectedValues.includes(option)
        ? selectedValues.filter((val) => val !== option)
        : [...selectedValues, option];
      onChange && onChange(updatedValues);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 border-dashed">
          <span className="mr-2">{icon}</span> {title}
          {selectedValues?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="outline" className="rounded-sm px-1 font-normal bg-primary/20">
                {selectedValues.length}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{t.noResults}.</CommandEmpty>
            <CommandGroup>
              {options.map((option: any, index: number) => {
                const value = typeof option === 'object' && option !== null ? option.value : option;
                const occurrences =
                  typeof option === 'object' && option !== null ? option.occurrences : null;

                const actualValue =
                  typeof option === 'object' && option !== null ? option.value : option;
                const isSelected = selectedValues.includes(actualValue);
                return (
                  <CommandItem key={`${index}option`}>
                    <div className="flex flex-row justify-between w-full">
                      <div className="flex flex-row" onClick={() => handleOptionSelect(value)}>
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <CheckIcon className={cn('h-4 w-4')} />
                        </div>
                        <div className="flex-1 text-left">{value}</div>
                      </div>
                      {occurrences !== null && <div className="text-right">{occurrences}</div>}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
