import { PropsType } from '@/app/(protected)/idr/types/TableInitProps';
import { mainComponent } from '@/app/(protected)/idr/work-queue/config';
import H1 from '@/app/components/htmlTags/h1';
import useTranslate from '@/app/lib/useTranslate';
import { DataTable } from '@/components/generic/DataTable';
import { workQueueType } from '@/zustand-store/idr/work-queue-store/types';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { useState } from 'react';
import { DataTableToolbar } from '../Toolbar';

function TableInit<TValue>(props: Readonly<PropsType<workQueueType, TValue>>) {
  const {
    columns,
    zustandStore,
    pageIndex,
    pageSize,
    pageCount,
    isFetching,
    isFetched,
    isSuccess,
    data,
    refetch
  } = props;

  const t = {
    workQueue: useTranslate({ mainComponent, word: 'workQueue' })
  };

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    initialState: {
      pagination: {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    },
    pageCount: pageCount,
    manualPagination: true,

    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function'
          ? updater({
              pageIndex: zustandStore.pageIndex,
              pageSize: zustandStore.pageSize
            })
          : updater;

      zustandStore.setPageIndex(newPagination.pageIndex);
      zustandStore.setPageSize(newPagination.pageSize);
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  return (
    <div className="space-y-4">
      <H1 classes="text-center">{t.workQueue}</H1>

      <div className={`${isFetching ? 'hidden' : ''}`}>
        <DataTableToolbar table={table} />
      </div>

      <DataTable
        columns={columns}
        isFetching={isFetching}
        isFetched={isFetched}
        isSuccess={isSuccess}
        zustandStore={zustandStore}
        table={table}
        data={data}
        refetch={refetch}
      />
    </div>
  );
}

export default TableInit;
