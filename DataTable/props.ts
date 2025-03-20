import { StoreType as InvoiceStoreType } from '@/zustand-store/idr/invoice-store/types';
import { StoreType as WorkQueueStoreType } from '@/zustand-store/idr/work-queue-store/types';
import { ColumnDef } from '@tanstack/react-table';

export type PropsType<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  isFetching: boolean;
  isFetched: boolean;
  isSuccess: boolean;
  zustandStore: WorkQueueStoreType | InvoiceStoreType;
  table: any;
  data: any[];
  refetch: () => void;
};
