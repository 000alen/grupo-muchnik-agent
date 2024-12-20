"use client";

import { createConsultant } from "@/app/actions/consultants";
import { trpc } from "@/lib/trpc-client";
import { useEffect, useActionState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User2 } from "lucide-react";

export default function NewConsultantForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const utils = trpc.useUtils();

  const [state, formAction] = useActionState(createConsultant, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      utils.consultants.getAll.invalidate();
      onSuccess?.();
    } else {
      toast.error(state.error ?? "Something went wrong");
    }
  }, [onSuccess, state.error, state.success, utils.consultants.getAll]);

  return (
    <Card className="card-custom">
      <form action={formAction} className="space-y-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <User2 className="h-5 w-5" />
          <h3 className="font-semibold text-foreground">New Consultant</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter consultant name"
            className="input-custom"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Enter email address"
            className="input-custom"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expertise">Expertise</Label>
          <Input
            id="expertise"
            name="expertise"
            placeholder="Enter areas of expertise"
            className="input-custom"
          />
        </div>

        <Button type="submit" className="button-custom w-full">
          Create Consultant
        </Button>
      </form>
    </Card>
  );
}
