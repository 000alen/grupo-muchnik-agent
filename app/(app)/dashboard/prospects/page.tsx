import Prospect from "@/components/custom/prospect";
import { createAsyncCaller } from "@/trpc/routers/app";
import Link from "next/link";

export default async function ProspectsPage() {
  const trpc = await createAsyncCaller();

  const prospects = await trpc.prospects.getAll();

  return (
    <main>
      <h1>Prospects</h1>

      <Link href="/dashboard/prospects/new">New Prospect</Link>

      <div>
        {prospects.map((prospect) => (
          <Prospect key={prospect.id} prospect={prospect} />
        ))}
      </div>
    </main>
  );
}
