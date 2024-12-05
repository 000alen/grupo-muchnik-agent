import Consultant from "@/components/custom/consultant";
import { createAsyncCaller } from "@/trpc/routers/app";
import Link from "next/link";

export default async function ConsultantsPage() {
  const trpc = await createAsyncCaller();

  const consultants = await trpc.consultants.getAll();

  return (
    <main>
      <h1>Consultants</h1>

      <Link href="/dashboard/consultants/new">New Consultant</Link>

      <div>
        {consultants.map((consultant) => (
          <Consultant key={consultant.id} consultant={consultant} />
        ))}
      </div>
    </main>
  );
}
