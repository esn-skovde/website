import { cn } from "../../lib/cn";

const Skeleton = ({ className }) => (
    <div className={cn("animate-pulse rounded-xl bg-surface-2", className)} aria-hidden="true" />
);

/** Placeholder shaped like the event/trip cards, so loading doesn't shift layout. */
export const CardSkeleton = ({ count = 3, className }) => (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="panel overflow-hidden">
                <Skeleton className="aspect-[16/10] rounded-none" />
                <div className="flex flex-col gap-3 p-6">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </div>
        ))}
    </div>
);

export default Skeleton;
