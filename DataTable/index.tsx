'use client';

import LoadingTable from '@/app/(protected)/idr/work-queue/components/DataTable/Loading';
import { mainComponent } from '@/app/(protected)/idr/work-queue/config';
import useTranslate from '@/app/lib/useTranslate';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import { DataTablePagination } from './Pagination';
import { PropsType } from './props';

export function DataTable<TData, TValue>(props: Readonly<PropsType<TData, TValue>>) {
  const { columns, isFetching, isFetched, isSuccess, zustandStore, table, data, refetch } = props;

  const t = {
    noResults: useTranslate({ mainComponent, word: 'noResults' })
  };

  return (
    <>
      {isFetching && <LoadingTable />}
      <div className={`${isFetching ? 'hidden' : ''} space-y-4`}>
        <Table className="border-separate border-spacing-y-2">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-primary/10"
                >
                  {row.getVisibleCells().map((cell: any, index: number) => (
                    <TableCell
                      key={cell.id}
                      className={`border border-t border-b border-l-0 border-r-0
            ${index === 0 ? 'border-l border-l-solid rounded-tl-lg rounded-bl-lg' : ''}
            ${index === row.getVisibleCells().length - 1 ? 'border-r border-r-solid rounded-tr-lg rounded-br-lg' : ''}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t.noResults}.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DataTablePagination
          table={table}
          isFetched={isFetched}
          isSuccess={isSuccess}
          zustandStore={zustandStore}
          data={data}
          refetch={refetch}
        />
      </div>
    </>
  );
}
