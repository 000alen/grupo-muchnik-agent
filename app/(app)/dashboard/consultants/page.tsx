import Consultant from "@/components/custom/consultant";
import { createAsyncCaller } from "@/trpc/routers/app";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function ConsultantsPage() {
  const trpc = await createAsyncCaller();
  const consultants = await trpc.consultants.getAll();

  return (
    <div className="container-custom space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Consultants</h1>
        <Link href="/dashboard/consultants/new">
          <Button variant="outline" className="button-custom">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Consultant
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {consultants.map((consultant) => (
          <Consultant key={consultant.id} consultant={consultant} />
        ))}
      </div>
    </div>
  );
}
