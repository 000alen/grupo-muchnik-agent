import Customer from "@/components/custom/customer";
import Contact from "@/components/custom/contact";
import { createAsyncCaller } from "@/trpc/routers/app";
import CustomerInteractions from "@/components/custom/customer-interactions";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const trpc = await createAsyncCaller();

  const [customer, contacts] = await Promise.all([
    trpc.customers.get({ id }),
    trpc.customers.getContacts({ id }),
  ]);

  return (
    <main>
      <Customer customer={customer} />

      <div>
        {contacts.map((contact) => (
          <Contact key={contact.contacts.id} contact={contact.contacts} />
        ))}
      </div>

      <CustomerInteractions customerId={id} />
    </main>
  );
}
