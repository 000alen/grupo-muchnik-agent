"use client";

import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";

export default function NewBulletinButton() {
  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.bulletins.create.useMutation({
    onSuccess: () => {
      utils.bulletins.getAll.invalidate();
    },
  });

  return (
    <Button
      onClick={() => mutate()}
      disabled={isPending}
      className="button-custom"
      variant="outline"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Bulletin
        </>
      )}
    </Button>
  );
}
