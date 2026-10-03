import { ListingPageSkeleton } from "@/components/ui/Skeleton";

/** Shown while a listing loads after a link is followed; mirrors the page's header, filters and cards. */
export default function Loading() {
  return <ListingPageSkeleton />;
}
