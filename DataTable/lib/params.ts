import { StoreType } from '@/zustand-store/idr/work-queue-store/types';
import { Table } from '@tanstack/react-table';

export type PageSizeHandlerParams<TData> = {
  table: Table<TData>;
  zustandStore: StoreType;
  page: string;
  refetch: () => void;
};
