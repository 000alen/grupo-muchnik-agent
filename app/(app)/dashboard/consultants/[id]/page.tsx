import Consultant from "@/components/custom/consultant";
import ConsultantCustomerInteractions from "@/components/custom/consultant-customer-interactions";
import ConsultantProspectInteractions from "@/components/custom/consultant-prospect-interactions";
import Customer from "@/components/custom/customer";
import Prospect from "@/components/custom/prospect";
import { createAsyncCaller } from "@/trpc/routers/app";

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
    <main>
      <Consultant key={consultant.id} consultant={consultant} />

      <section>
        <div>
          <h2>Customers</h2>

          <div>
            {customers.map((customer) => (
              <Customer
                key={customer.customers.id}
                customer={customer.customers}
              />
            ))}
          </div>
        </div>

        <div>
          <h3>Latest Interactions</h3>

          <ConsultantCustomerInteractions consultantId={id} />
        </div>
      </section>

      <section>
        <div>
          <h2>Prospects</h2>

          <div>
            {prospects.map((prospect) => (
              <Prospect
                key={prospect.prospects.id}
                prospect={prospect.prospects}
              />
            ))}
          </div>
        </div>

        <div>
          <h3>Latest Interactions</h3>

          <ConsultantProspectInteractions consultantId={id} />
        </div>
      </section>
    </main>
  );
}
