import Prospect from "@/components/custom/prospect";
import { createAsyncCaller } from "@/trpc/routers/app";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function ProspectsPage() {
  const trpc = await createAsyncCaller();
  const prospects = await trpc.prospects.getAll();

  return (
    <div className="container-custom space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Prospects</h1>
        <Link href="/dashboard/prospects/new">
          <Button variant="outline" className="button-custom">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Prospect
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prospects.map((prospect) => (
          <Prospect key={prospect.id} prospect={prospect} />
        ))}
      </div>
    </div>
  );
}
