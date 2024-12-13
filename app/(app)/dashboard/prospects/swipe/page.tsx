import { createAsyncCaller } from "@/trpc/routers/app";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProspectSwiper from "@/components/custom/prospect-swiper";

export default async function ProspectSwipePage() {
  const trpc = await createAsyncCaller();
  const prospects = await trpc.prospects.getAll();

  return (
    <div className="container-custom space-y-8 py-8">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/prospects">
          <Button variant="ghost" size="icon" className="button-custom">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Swipe Prospects</h1>
      </div>

      <div className="mx-auto max-w-md">
        <ProspectSwiper prospects={prospects} />
      </div>
    </div>
  );
}