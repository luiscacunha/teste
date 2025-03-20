import { FilterProps } from '@/app/(protected)/idr/invoice/components/DataTable/ToolBar/components/props';
import { mainComponent } from '@/app/(protected)/idr/work-queue/config';
import useTranslate from '@/app/lib/useTranslate';
import { DataTableFilter } from '@/components/generic/DataTable/Filter';
import { DatePicker } from '@/components/generic/DatePicker';
import Icon from '@/components/generic/Icon';
import { Button } from '@/components/ui/button';
import { useFilterQueue } from '@/zustand-store/idr/filter-store';
import { useworkQueue } from '@/zustand-store/idr/work-queue-store';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Filters({ filterOptions, applyFilters }: FilterProps) {
  const workQueue = useworkQueue();
  const filterQueue = useFilterQueue();
  const { selectedFilters, uploadedDatePicker } = useFilterQueue();

  const t = {
    clearFilters: useTranslate({ mainComponent, word: 'clearFilters' }),
    applyFilters: useTranslate({ mainComponent, word: 'applyFilters' }),
    creationDate: useTranslate({ mainComponent, word: 'creationDate' })
  };

  const icon = <Icon name="info-circle" />;

  const handleFilterChange = (updatedValues: string[], key: string) => {
    filterQueue.setSelectedFilters({ ...selectedFilters, [key]: [...updatedValues] });
  };

  const handleUploadedDateChange = (date: Date | undefined) => {
    filterQueue.setUploadedDatePicker(date);
    filterQueue.setSelectedFilters({
      ...selectedFilters,
      upload_date: date ? date.toISOString() : ''
    });
  };

  const clearFilters = () => {
    filterQueue.resetFilters();
    if (filterQueue.fileName) {
      filterQueue.setFilters({ fileName: filterQueue.fileName });
    } else {
      filterQueue.setFilters({});
    }
  };

  return (
    <div className="flex flex-wrap gap-1">
      {Object.keys(filterOptions).map((option, index) => {
        return (
          <DataTableFilter
            key={`${index}option`}
            title={option}
            options={filterOptions[option]}
            icon={icon}
            selectedValues={selectedFilters[option] || []}
            onChange={(updatedValues: string[]) => handleFilterChange(updatedValues, option)}
          />
        );
      })}

      <DatePicker
        text={uploadedDatePicker || t.creationDate}
        onDateChange={handleUploadedDateChange}
        icon={<Icon name="calendar" />}
      />
      <Button variant="outline-primary" onClick={applyFilters} className="h-10 px-2 lg:px-3">
        {t.applyFilters}
      </Button>
      <Button variant="outline-primary" onClick={clearFilters} className="h-10 px-2 lg:px-3">
        {t.clearFilters}
        <XMarkIcon className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
