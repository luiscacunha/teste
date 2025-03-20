import { Column } from '@tanstack/react-table';

export type PropsType<TData, TValue> = {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  icon?: React.ReactElement;
};
