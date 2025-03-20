import { PageSizeHandlerParams } from './params';

export const pageSizeHandler = <TData,>(args: PageSizeHandlerParams<TData>) => {
  const { table, zustandStore, page, refetch } = args;
  const pageSize = Number(page);

  // Update Zustand store
  zustandStore.setPageSize(pageSize); // Update page size in store
  zustandStore.setPageIndex(0); // Reset to first page
  table.setPagination({ pageIndex: 0, pageSize });
};
