import Prospect from "@/components/custom/prospect";
import Contact from "@/components/custom/contact";
import { createAsyncCaller } from "@/trpc/routers/app";
import ProspectInteractions from "@/components/custom/prospect-interactions";
import NewProspectContactButton from "@/components/custom/new-prospect-contact-button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UpgradeToCustomerButton from "@/components/custom/upgrade-to-customer-button";

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
    <div className="container-custom space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/prospects">
            <Button variant="ghost" size="icon" className="button-custom">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Prospect Details
          </h1>
        </div>
        <UpgradeToCustomerButton prospectId={id} />
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          <Prospect prospect={prospect} />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">
                Interactions
              </h2>
            </div>
            <ProspectInteractions prospectId={id} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Contacts</h2>
            <NewProspectContactButton prospectId={id} />
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
