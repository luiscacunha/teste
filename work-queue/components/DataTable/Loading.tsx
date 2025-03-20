import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingTable() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Skeleton className="h-[32px] w-[250px] border-1" />
        <Skeleton className="h-[32px] w-[90px] border-1" />
        <Skeleton className="h-[32px] w-[90px] border-1" />
        <Skeleton className="h-[32px] w-[122px] border-1" />
        <Skeleton className="h-[32px] w-[102px] border-1" />
        <Skeleton className="h-[32px] w-[140px] border-1" />
      </div>

      <div className="flex flex-col">
        <Skeleton className="h-[48px] w-full rounded-t-md rounded-b-none border-1" />
        <Skeleton className="h-[442.5px] w-full border-1" />
      </div>

      <div className="flex justify-end gap-2">
        <Skeleton className="h-[32px] w-[70px] border-1 mx-[165px]" />
        <Skeleton className="h-[32px] w-[32px] border-1 " />
        <Skeleton className="h-[32px] w-[32px] border-1" />
        <Skeleton className="h-[32px] w-[32px] border-1" />
        <Skeleton className="h-[32px] w-[32px] border-1" />
      </div>
    </div>
  );
}
