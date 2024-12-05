import Customer from "@/components/custom/customer";
import { createAsyncCaller } from "@/trpc/routers/app";
import Link from "next/link";

export default async function CustomersPage() {
  const trpc = await createAsyncCaller();

  const customers = await trpc.customers.getAll();

  return (
    <main>
      <h1>Customers</h1>

      <Link href="/dashboard/customers/new">New Customer</Link>

      <div>
        {customers.map((customer) => (
          <Customer key={customer.id} customer={customer} />
        ))}
      </div>
    </main>
  );
}
