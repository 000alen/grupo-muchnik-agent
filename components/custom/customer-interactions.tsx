"use client";

import { trpc } from "@/lib/trpc-client";
import CustomerInteraction from "./customer-interaction";

export default function CustomerInteractions({
  customerId,
}: {
  customerId: string;
}) {
  const { data, isLoading, isError, error, fetchNextPage } =
    trpc.customers.getLatestInteractions.useInfiniteQuery(
      {
        id: customerId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  if (isError) return <div>{error.message}</div>;

  return (
    <div>
      <button onClick={() => fetchNextPage()} disabled={isLoading}>
        Load More
      </button>

      {data?.pages
        .flatMap((page) => page.items)
        .map((interaction) => (
          <CustomerInteraction key={interaction.id} interaction={interaction} />
        ))}
    </div>
  );
}
