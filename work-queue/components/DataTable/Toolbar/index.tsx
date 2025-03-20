'use client';

import { endpoint } from '@/app/(protected)/idr/endpoints';
import { PropsType } from '@/app/(protected)/idr/types/DataTableToolBarProps';
import ToolBar from '@/app/components/ToolBar';
import { totalCount } from '@/utils/helpers';
import { useFilterQueue } from '@/zustand-store/idr/filter-store';
import { useworkQueue } from '@/zustand-store/idr/work-queue-store';
import { useQuery } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Filters from './components/Filters';

type FilterOptionsType = {
  [key: string]: any;
};
type TransformedObject = {
  variables?: { [key: string]: string | string[] } | {};
  [key: string]: string | string[] | { [key: string]: string | string[] } | {} | undefined;
};
export function DataTableToolbar<TData>({ table }: Readonly<PropsType<TData>>) {
  const workQueue = useworkQueue();
  const filterQueue = useFilterQueue();
  const { filters, selectedFilters } = useFilterQueue();
  const [filterOptions, setFilterOptions] = useState<FilterOptionsType>({});
  const [showFilters, setShowFilters] = useState(false);
  const [didMount, setDidMount] = useState(false);

  const { isError, error, isFetching, isFetched, isSuccess, isPending, refetch } = useQuery({
    queryKey: [`idr-get-tasks-filters`],
    queryFn: async () => {
      const session = await getSession();
      const res = await endpoint['idr-get-tasks-filters']({
        token: session?.user?.id,
        expires: session?.expires
      });
      if (Object.keys(res).length === 0) {
        return;
      }
      const { names, assignees, variables } = res;
      const filters = {
        task: names,
        legalEnities: variables.acquirer_name,
        supplier: variables.supplier_name.map((obj: any, index: number) => ({
          value: `${obj.value}-${variables.supplier_vat[index].value}`,
          occurrences: `${obj.occurrences}`
        }))
      };
      setFilterOptions({ ...filters });
      return filters;
    }
  });
  const toggleFilters = () => {
    if (!showFilters) {
      if (filterQueue?.data?.upload_date) {
        filterQueue.setUploadedDatePicker(new Date(selectedFilters?.upload_date as string));
      } else {
        filterQueue.setUploadedDatePicker('');
      }
    }
    filterQueue.setSelectedFilters({ ...filterQueue.data });
    setShowFilters(!showFilters);
  };

  const applyFilters = () => {
    let transformedObject: any = { variables: {} };

    if (Object.keys(selectedFilters).length > 0) {
      Object.entries(selectedFilters).forEach(([key, value]) => {
        if (key === 'supplier' && Array.isArray(value)) {
          value.forEach((item) => {
            if (item.includes('-')) {
              const [name, vat] = item.split('-');
              if (!transformedObject.variables.supplier_name) {
                transformedObject.variables.supplier_name = [];
              }
              if (!transformedObject.variables.supplier_vat) {
                transformedObject.variables.supplier_vat = [];
              }
              transformedObject.variables.supplier_name.push(name.trim());
              transformedObject.variables.supplier_vat.push(vat.trim());
            }
          });
        } else if (key === 'legalEnities') {
          if (!transformedObject.variables.acquirer_name) {
            transformedObject.variables.acquirer_name = [];
          }
          transformedObject.variables['acquirer_name'] = value;
        } else if (key === 'task') {
          transformedObject['names'] = value;
        } else {
          transformedObject[key] = value;
        }
      });
    }

    filterQueue.setFilters({ ...filters, ...transformedObject });
    filterQueue.setData({ ...selectedFilters });
  };

  useEffect(() => {
    setDidMount(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <ToolBar
        showSearch={false}
        onClick={() => {
          toggleFilters();
        }}
        showFilters={showFilters}
        total={totalCount(filterQueue.data)}
      />

      {showFilters && (
        <div className={`grid grid-cols-2 md:flex gap-2`}>
          <Filters filterOptions={filterOptions} applyFilters={applyFilters} />
        </div>
      )}
    </div>
  );
}
