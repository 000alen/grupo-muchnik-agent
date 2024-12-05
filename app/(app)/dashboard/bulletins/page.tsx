import Bulletin from "@/components/custom/bulletin";
import NewBulletinButton from "@/components/custom/new-bulletin-button";
import { createAsyncCaller } from "@/trpc/routers/app";

export default async function BulletinsPage() {
  const trpc = await createAsyncCaller();

  const bulletins = await trpc.bulletins.getAll();

  return (
    <main>
      <h1>Bulletins</h1>

      <NewBulletinButton />

      <div>
        {bulletins.map((bulletin) => (
          <Bulletin key={bulletin.id} bulletin={bulletin} />
        ))}
      </div>
    </main>
  );
}
