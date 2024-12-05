"use client";

import { createSource, updateSource } from "@/app/actions/sources";
import { trpc } from "@/lib/trpc-client";
import { useEffect, useActionState } from "react";
import { toast } from "sonner";
import { type ConfigSources } from "@/db/config-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

interface Props {
  source?: typeof ConfigSources.$inferSelect;
  onSuccess?: () => void;
}

export function SourceForm({ source, onSuccess }: Props) {
  const utils = trpc.useUtils();
  const [state, formAction] = useActionState(
    source ? updateSource : createSource,
    {
      success: false,
      error: null,
    }
  );

  useEffect(() => {
    if (state.success) {
      utils.sources.getAll.invalidate();
      onSuccess?.();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [onSuccess, state.error, state.success, utils.sources.getAll]);

  return (
    <Card className="card-custom">
      <form action={formAction} className="space-y-6">
        {source && <input type="hidden" name="id" value={source.id} />}
        
        <div className="space-y-2">
          <Label htmlFor="sourceName">Source Name</Label>
          <Input
            id="sourceName"
            type="text"
            name="sourceName"
            placeholder="Enter source name"
            defaultValue={source?.sourceName}
            className="input-custom"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sourceUrl">Source URL</Label>
          <Input
            id="sourceUrl"
            type="text"
            name="sourceUrl"
            placeholder="Enter source URL"
            defaultValue={source?.sourceUrl}
            className="input-custom"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            name="isActive"
            defaultChecked={source?.isActive ?? true}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>

        <Button type="submit" className="button-custom w-full">
          {source ? "Update Source" : "Create Source"}
        </Button>
      </form>
    </Card>
  );
}
