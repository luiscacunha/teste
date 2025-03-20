'use client';

import { useFilterQueue } from '@/zustand-store/idr/filter-store';
import { useworkQueue } from '@/zustand-store/idr/work-queue-store';
import { useQuery } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { endpoint } from '../endpoints';
import { columns } from './components/DataTable/Columns';
import { APIResponseSchema } from './components/DataTable/Columns/schema';
import LoadingTable from './components/DataTable/Loading';
import TableInit from './components/DataTable/TableInit';

export default function WorkQueue() {
  const workQueue = useworkQueue();
  const filterQueue = useFilterQueue();
  const pageIndex = workQueue.pageIndex;
  const pageSize = workQueue.pageSize;

  const [didMount, setDidMount] = useState(false);
  const { isError, error, isFetching, isFetched, isSuccess, isPending, refetch } = useQuery({
    queryKey: ['idr-tasks', { pageSize, pageIndex, filters: filterQueue.filters || {} }],
    queryFn: async () => {
      let pageIndex = workQueue.pageIndex;

      if (!didMount) {
        pageIndex = 0;
      }
      const session = await getSession();
      const res = await endpoint['idr-get-tasks'](pageIndex, pageSize, filterQueue.filters, {
        token: session?.user?.id,
        expires: session?.expires
      });

      if (res.tasks.length === 0 || !res.tasks) {
        workQueue.resetStore();
        return {};
      }

      const newData = res.tasks.map((task: APIResponseSchema) => ({
        id: task.id,
        name: task.name,
        assignee: task.assignee,
        created: workQueue.formatDate(task.created),
        legalEntity: task.variables.acquirer_vat.value + ' - ' + task.variables.acquirer_name.value,
        supplier: task.variables.supplier_vat.value + ' - ' + task.variables.supplier_name.value
      }));

      workQueue.setResults(res.total);
      workQueue.setData(newData);
      return res;
    },
    refetchOnWindowFocus: false,
    enabled: didMount
  });

  const handlePageCount = () => {
    const results = workQueue.results;
    const pageSize = workQueue.pageSize;
    const pagesAvailable = Math.ceil(results / pageSize);
    workQueue.setPageCount(pagesAvailable);
  };

  useEffect(() => {
    if (!didMount) {
      workQueue.setData([]);
      workQueue.setPageIndex(0);
      workQueue.setCurrentPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didMount]);

  useEffect(() => {
    handlePageCount();
  }, [workQueue.results, workQueue.pageSize]);

  useEffect(() => {
    filterQueue.resetFilters();
    filterQueue.setFilters({});
    filterQueue.setSearchValue('');
  }, []);

  useEffect(() => {
    setDidMount(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isError) {
    console.error(error);
  }

  if (isFetching || isPending) {
    return <LoadingTable />;
  }

  return (
    <TableInit
      columns={columns}
      zustandStore={workQueue}
      pageSize={pageSize}
      pageCount={workQueue.pageCount}
      pageIndex={pageIndex}
      isFetching={isFetching}
      isFetched={isFetched}
      isSuccess={isSuccess}
      data={workQueue.data}
      refetch={refetch}
    />
  );
}
