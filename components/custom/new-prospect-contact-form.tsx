"use client";

import { createProspectContact } from "@/app/actions/contacts";
import { trpc } from "@/lib/trpc-client";
import { useEffect, useActionState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function NewProspectContactForm({
  prospectId,
  onSuccess,
}: {
  prospectId: string;
  onSuccess?: () => void;
}) {
  const utils = trpc.useUtils();

  const [state, formAction] = useActionState(createProspectContact, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      utils.prospects.getContacts.invalidate({ id: prospectId });
      onSuccess?.();
    } else {
      toast.error(state.error ?? "Something went wrong");
    }
  }, [
    prospectId,
    onSuccess,
    state.error,
    state.success,
    utils.prospects.getContacts,
  ]);

  return (
    <Card className="card-custom">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="prospectId" value={prospectId} />
        
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="Enter contact name"
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
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            className="input-custom"
          />
        </div>

        <Button type="submit" className="button-custom w-full">
          Create Contact
        </Button>
      </form>
    </Card>
  );
}
