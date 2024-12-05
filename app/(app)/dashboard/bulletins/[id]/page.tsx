import Bulletin from "@/components/custom/bulletin";
import { createAsyncCaller } from "@/trpc/routers/app";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BulletinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trpc = await createAsyncCaller();
  const bulletin = await trpc.bulletins.get({ id: parseInt(id) });

  return (
    <div className="container-custom space-y-8 py-8">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/bulletins">
          <Button variant="ghost" size="icon" className="button-custom">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Bulletin Details</h1>
      </div>

      <div className="mx-auto max-w-3xl">
        <Bulletin key={bulletin.id} bulletin={bulletin} showContent />
      </div>
    </div>
  );
}
