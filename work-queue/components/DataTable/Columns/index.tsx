'use client';

import FormDialog from '@/app/(protected)/idr/work-queue/components/FormDialog';
import { mainComponent } from '@/app/(protected)/idr/work-queue/config';
import { cellWrapper } from '@/app/components/CellWrapper';
import useTranslate from '@/app/lib/useTranslate';
import { filterFunction } from '@/app/lib/utils';
import { DataTableColumnHeader } from '@/components/generic/DataTable/ColumnHeader';
import { workQueueType } from '@/zustand-store/idr/work-queue-store/types';
import { ColumnDef } from '@tanstack/react-table';
import Workflow from '../../WorkflowDialog';

const Header: React.FC<{ column: any; word: string }> = ({ column, word }) => {
  // @ts-ignore
  return <DataTableColumnHeader column={column} title={useTranslate({ mainComponent, word })} />;
};

export const columns: ColumnDef<workQueueType>[] = [
  {
    accessorKey: 'name',
    enableSorting: true,
    header: (props) => <Header {...props} word="task" />,
    cell: ({ row }) => {
      return (
        <>
          {cellWrapper({
            children: row.getValue('name') ? row.getValue('name') : '-',
            isBold: true
          })}
        </>
      );
    },
    filterFn: filterFunction
  },
  {
    accessorKey: 'assignee',
    enableSorting: true,
    header: (props) => <Header {...props} word="owner" />,
    cell: ({ row }) => {
      return (
        <>
          {cellWrapper({
            children: row.getValue('assignee') ? row.getValue('assignee') : '-',
            isBold: true
          })}
        </>
      );
    },
    filterFn: filterFunction
  },
  {
    accessorKey: 'legalEntity',
    enableSorting: true,
    header: (props) => <Header {...props} word="legalEntity" />,
    cell: ({ row }) => {
      return (
        <>
          {cellWrapper({
            children: row.getValue('legalEntity') ? row.getValue('legalEntity') : '-'
          })}
        </>
      );
    },
    filterFn: filterFunction
  },
  {
    accessorKey: 'supplier',
    enableSorting: true,
    header: (props) => <Header {...props} word="supplier" />,
    cell: ({ row }) => {
      return (
        <>{cellWrapper({ children: row.getValue('supplier') ? row.getValue('supplier') : '-' })}</>
      );
    },
    filterFn: filterFunction
  },
  {
    accessorKey: 'created',
    enableSorting: true,
    header: (props) => <Header {...props} word="creationDate" />,
    cell: ({ row }) => {
      return <>{cellWrapper({ children: row.getValue('created') })}</>;
    },
    filterFn: filterFunction
  },
  {
    accessorKey: 'id',
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => {
      const id = row.original.id;

      return (
        <>
          {cellWrapper({
            children: (
              <div className="flex gap-2">
                <FormDialog id={id}></FormDialog>
                <Workflow id={id} />
              </div>
            )
          })}
        </>
      );
    },
    filterFn: filterFunction
  }
];
