import { mainComponent } from '@/app/(protected)/idr/work-queue/config';
import useTranslate from '@/app/lib/useTranslate';

export default function useTranslations() {
  return {
    of: useTranslate({ mainComponent, word: 'of' }),
    results: useTranslate({ mainComponent, word: 'results' }),
    rowsPerPage: useTranslate({ mainComponent, word: 'rowsPerPage' }),
    page: useTranslate({ mainComponent, word: 'page' }),
    gotToFirstPage: useTranslate({ mainComponent, word: 'gotToFirstPage' }),
    gotToPreviousPage: useTranslate({ mainComponent, word: 'gotToPreviousPage' }),
    gotToNextPage: useTranslate({ mainComponent, word: 'gotToNextPage' }),
    gotToLastPage: useTranslate({ mainComponent, word: 'gotToLastPage' })
  };
}
