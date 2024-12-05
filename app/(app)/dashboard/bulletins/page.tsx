import Bulletin from "@/components/custom/bulletin";
import NewBulletinButton from "@/components/custom/new-bulletin-button";
import { createAsyncCaller } from "@/trpc/routers/app";

export default async function BulletinsPage() {
  const trpc = await createAsyncCaller();
  const bulletins = await trpc.bulletins.getAll();

  return (
    <div className="container-custom space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bulletins</h1>
        <NewBulletinButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {bulletins.map((bulletin) => (
          <Bulletin key={bulletin.id} bulletin={bulletin} />
        ))}
      </div>
    </div>
  );
}
