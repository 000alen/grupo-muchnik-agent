"use client";

import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { trpc } from "@/lib/trpc-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UpgradeToCustomerButton({
  prospectId,
}: {
  prospectId: string;
}) {
  const router = useRouter();

  const { mutate, isPending } = trpc.prospects.upgradeToCustomer.useMutation({
    onSuccess: (result) => {
      toast.success("Upgraded to customer");

      router.push(`/dashboard/customers/${result.id}`);
    },
  });

  const handleClick = () => {
    mutate({ id: prospectId });

    // Fire multiple bursts of confetti
    const defaults = {
      origin: { y: 0.7 },
      spread: 100,
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  return (
    <Button
      onClick={handleClick}
      className="bg-green-600 hover:bg-green-700"
      disabled={isPending}
    >
      <PartyPopper className="mr-2 h-4 w-4" />
      Upgrade to Customer!
    </Button>
  );
}
