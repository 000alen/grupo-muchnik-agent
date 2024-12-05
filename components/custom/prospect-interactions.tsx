"use client";

import { trpc } from "@/lib/trpc-client";
import ProspectInteraction from "./prospect-interaction";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProspectInteractions({
  prospectId,
}: {
  prospectId: string;
}) {
  const { data, isLoading, isError, error, fetchNextPage } =
    trpc.prospects.getLatestInteractions.useInfiniteQuery(
      {
        id: prospectId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="card-custom">
      <div className="space-y-4">
        <div className="space-y-4">
          {data?.pages
            .flatMap((page) => page.items)
            .map((interaction) => (
              <ProspectInteraction key={interaction.id} interaction={interaction} />
            ))}
        </div>

        <Button
          onClick={() => fetchNextPage()}
          disabled={isLoading}
          variant="outline"
          className="button-custom w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Load More"
          )}
        </Button>
      </div>
    </Card>
  );
}
