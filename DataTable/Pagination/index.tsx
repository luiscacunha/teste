import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { pageSizeHandler } from '../lib/helpers';
import { PropsType } from './props';
import useTranslations from './translations';

export function DataTablePagination<TData>(props: Readonly<PropsType<TData>>) {
  const { table, isFetched, isSuccess, zustandStore, data, refetch } = props;
  const pageCount = zustandStore.pageCount;
  const pageIndex = zustandStore.pageIndex;
  const currentPage = zustandStore.currentPage;

  const t = useTranslations();

  const handlePageSize = (page: string) => pageSizeHandler({ table, zustandStore, page, refetch });

  const handlePreviousPage = () => {
    zustandStore.setPageIndex(pageIndex - 1);
  };

  const handleFirstPage = () => {
    zustandStore.setPageIndex(0);
  };

  const handleNextPage = () => {
    zustandStore.setPageIndex(pageIndex + 1);
  };

  const handleLastPage = () => {
    zustandStore.setPageIndex(zustandStore.pageCount - 1);
  };

  return (
    <div className="flex items-center justify-end sm:justify-between px-2">
      <div className="hidden sm:flex flex-1 text-sm text-muted-foreground">
        {zustandStore.results} {t.results}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium hidden sm:flex">{t.rowsPerPage}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => handlePageSize(value)}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="bottom">
              {[5, 10].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          <span className="hidden sm:flex">{t.page} </span>
          {table.getState().pagination.pageIndex + 1} {t.of} {zustandStore.pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              handleFirstPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t.gotToFirstPage}</span>
            <ChevronDoubleLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              handlePreviousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t.gotToPreviousPage}</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              handleNextPage();
            }}
            disabled={pageIndex + 1 == pageCount}
          >
            <span className="sr-only">{t.gotToNextPage}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              handleLastPage();
            }}
            disabled={pageIndex + 1 == pageCount}
          >
            <span className="sr-only">{t.gotToLastPage}</span>
            <ChevronDoubleRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
