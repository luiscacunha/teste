import { Column } from '@tanstack/react-table';

export type PropsType<TData, TValue> = React.HTMLAttributes<HTMLDivElement> & {
  column: Column<TData, TValue>;
  title: string;
};
