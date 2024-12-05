import Bulletin from "@/components/custom/bulletin";
import { createAsyncCaller } from "@/trpc/routers/app";

export default async function BulletinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const trpc = await createAsyncCaller();

  const bulletin = await trpc.bulletins.get({ id: parseInt(id) });

  return (
    <main>
      <Bulletin key={bulletin.id} bulletin={bulletin} />
    </main>
  );
}
