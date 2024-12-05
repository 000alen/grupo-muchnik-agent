"use client";

import { createCustomerContact } from "@/app/actions/contacts";
import { trpc } from "@/lib/trpc-client";
import { useEffect, useActionState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

export default function NewCustomerContactForm({
  customerId,
  onSuccess,
}: {
  customerId: string;
  onSuccess?: () => void;
}) {
  const utils = trpc.useUtils();

  const [state, formAction] = useActionState(createCustomerContact, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      utils.customers.getContacts.invalidate({ id: customerId });
      onSuccess?.();
    } else {
      toast.error(state.error ?? "Something went wrong");
    }
  }, [
    customerId,
    onSuccess,
    state.error,
    state.success,
    utils.customers.getContacts,
  ]);

  return (
    <Card className="card-custom">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="customerId" value={customerId} />
        
        <div className="flex items-center space-x-2 text-muted-foreground">
          <UserPlus className="h-5 w-5" />
          <h3 className="font-semibold text-foreground">New Contact</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
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
