"use client";

import { createCustomer } from "@/app/actions/customers";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export default function NewCustomerForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [state, formAction] = useFormState(createCustomer, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    } else {
      toast.error(state.error ?? "Something went wrong");
    }
  }, [onSuccess, state.error, state.success]);

  return (
    <form action={formAction}>
      <input type="text" name="companyName" />
      <input type="text" name="industry" />
      <button type="submit">Create</button>
    </form>
  );
}
