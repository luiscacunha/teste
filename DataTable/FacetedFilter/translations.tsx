import { mainComponent } from '@/app/(protected)/idr/work-queue/config';
import useTranslate from '@/app/lib/useTranslate';

export default function useTranslations() {
  return {
    noResults: useTranslate({ mainComponent, word: 'noResults' }),
    selected: useTranslate({ mainComponent, word: 'selected' })
  };
}
