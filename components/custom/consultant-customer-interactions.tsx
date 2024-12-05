"use client";

import { trpc } from "@/lib/trpc-client";
import CustomerInteraction from "./customer-interaction";

export default function ConsultantCustomerInteractions({
  consultantId,
}: {
  consultantId: string;
}) {
  const { data, isLoading, isError, error, fetchNextPage } =
    trpc.consultants.getLatestCustomerInteractions.useInfiniteQuery(
      {
        id: consultantId,
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
