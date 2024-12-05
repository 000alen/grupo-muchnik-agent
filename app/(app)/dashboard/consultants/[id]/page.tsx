import Consultant from "@/components/custom/consultant";
import ConsultantCustomerInteractions from "@/components/custom/consultant-customer-interactions";
import ConsultantProspectInteractions from "@/components/custom/consultant-prospect-interactions";
import Customer from "@/components/custom/customer";
import Prospect from "@/components/custom/prospect";
import { createAsyncCaller } from "@/trpc/routers/app";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ConsultantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trpc = await createAsyncCaller();

  const [consultant, customers, prospects] = await Promise.all([
    trpc.consultants.get({ id }),
    trpc.consultants.getRelatedCustomers({ id }),
    trpc.consultants.getRelatedProspects({ id }),
  ]);

  return (
    <div className="container-custom space-y-8 py-8">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/consultants">
          <Button variant="ghost" size="icon" className="button-custom">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Consultant Details</h1>
      </div>

      <div className="space-y-8">
        <Consultant key={consultant.id} consultant={consultant} />

        <div className="grid gap-8 md:grid-cols-2">
          <section className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Customers</h2>
              <div className="grid gap-4">
                {customers.map((customer) => (
                  <Customer
                    key={customer.customers.id}
                    customer={customer.customers}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold tracking-tight">Latest Customer Interactions</h3>
              <ConsultantCustomerInteractions consultantId={id} />
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Prospects</h2>
              <div className="grid gap-4">
                {prospects.map((prospect) => (
                  <Prospect
                    key={prospect.prospects.id}
                    prospect={prospect.prospects}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold tracking-tight">Latest Prospect Interactions</h3>
              <ConsultantProspectInteractions consultantId={id} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
