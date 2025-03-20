import { mainComponent } from '@/app/(protected)/idr/work-queue/config';
import useTranslate from '@/app/lib/useTranslate';
import { cn } from '@/app/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { PropsType } from './props';

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: Readonly<PropsType<TData, TValue>>) {
  const t = {
    asc: useTranslate({ mainComponent, word: 'asc' }),
    desc: useTranslate({ mainComponent, word: 'desc' })
  };

  let sortIcon;
  if (column.getIsSorted() === 'desc') {
    sortIcon = <ArrowDownIcon className="ml-2 h-4 w-4" />;
  } else if (column.getIsSorted() === 'asc') {
    sortIcon = <ArrowUpIcon className="ml-2 h-4 w-4" />;
  } else if (column.getCanSort()) {
    sortIcon = (
      <div className="flex flex-col relative bottom-1">
        <ChevronUpIcon className="ml-2 h-4 w-4" />
        <ChevronDownIcon className="ml-2 h-4 w-4 absolute top-2" />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="text"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:text-primary text-default font-bold hover:text-primary"
          >
            <span>{title}</span>
            {sortIcon}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => column.toggleSorting(false)}
            className="cursor-pointer focus:bg-primary/10"
          >
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            {t.asc}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.toggleSorting(true)}
            className="cursor-pointer focus:bg-primary/10"
          >
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            {t.desc}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
