"use client";

import { trpc } from "@/lib/trpc-client";
import ProspectInteraction from "./prospect-interaction";

export default function ConsultantProspectInteractions({
  consultantId,
}: {
  consultantId: string;
}) {
  const { data, isLoading, isError, error, fetchNextPage } =
    trpc.consultants.getLatestProspectInteractions.useInfiniteQuery(
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
          <ProspectInteraction key={interaction.id} interaction={interaction} />
        ))}
    </div>
  );
}
