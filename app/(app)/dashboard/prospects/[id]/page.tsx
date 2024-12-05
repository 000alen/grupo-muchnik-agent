import Prospect from "@/components/custom/prospect";
import Contact from "@/components/custom/contact";
import { createAsyncCaller } from "@/trpc/routers/app";
import ProspectInteractions from "@/components/custom/prospect-interactions";

export default async function ProspectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const trpc = await createAsyncCaller();

  const [prospect, contacts] = await Promise.all([
    trpc.prospects.get({ id }),
    trpc.prospects.getContacts({ id }),
  ]);

  return (
    <main>
      <Prospect prospect={prospect} />

      <div>
        {contacts.map((contact) => (
          <Contact key={contact.contacts.id} contact={contact.contacts} />
        ))}
      </div>

      <ProspectInteractions prospectId={id} />
    </main>
  );
}
