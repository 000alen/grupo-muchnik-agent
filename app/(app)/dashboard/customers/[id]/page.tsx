import Customer from "@/components/custom/customer";
import Contact from "@/components/custom/contact";
import { createAsyncCaller } from "@/trpc/routers/app";
import CustomerInteractions from "@/components/custom/customer-interactions";
import NewCustomerContactButton from "@/components/custom/new-customer-contact-button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="container-custom space-y-8 py-8">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="icon" className="button-custom">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Customer Details</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          <Customer customer={customer} />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Interactions</h2>
            </div>
            <CustomerInteractions customerId={id} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Contacts</h2>
            <NewCustomerContactButton customerId={id} />
          </div>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Contact key={contact.contacts.id} contact={contact.contacts} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
