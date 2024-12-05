"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function TriggerJobButton() {
  const router = useRouter();

  const { mutate, isPending } = trpc.ai.scan.useMutation({
    onSuccess: () => {
      toast.success("Updated prospect interactions");
      router.refresh();
    },
  });

  return (
    <Button onClick={() => mutate()} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Running...
        </>
      ) : (
        "Trigger Job"
      )}
    </Button>
  );
}
