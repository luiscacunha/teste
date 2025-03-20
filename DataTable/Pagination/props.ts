import { Table } from '@tanstack/react-table';

export type PropsType<TData> = {
  table: Table<TData>;
  isFetched: boolean;
  isSuccess: boolean;
  zustandStore: any;
  data: any[];
  refetch: () => void;
};
