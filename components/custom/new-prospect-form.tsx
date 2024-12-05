"use client";

import { createProspect } from "@/app/actions/prospects";
import { trpc } from "@/lib/trpc-client";
import { useEffect, useActionState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";

export default function NewProspectForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const utils = trpc.useUtils();

  const [state, formAction] = useActionState(createProspect, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      utils.prospects.getAll.invalidate();
      onSuccess?.();
    } else {
      toast.error(state.error ?? "Something went wrong");
    }
  }, [onSuccess, state.error, state.success, utils.prospects.getAll]);

  return (
    <Card className="card-custom">
      <form action={formAction} className="space-y-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Building2 className="h-5 w-5" />
          <h3 className="font-semibold text-foreground">New Prospect</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Enter company name"
            className="input-custom"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            name="industry"
            placeholder="Enter industry"
            className="input-custom"
          />
        </div>

        <Button type="submit" className="button-custom w-full">
          Create Prospect
        </Button>
      </form>
    </Card>
  );
}
