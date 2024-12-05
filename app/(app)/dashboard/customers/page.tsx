import Customer from "@/components/custom/customer";
import { createAsyncCaller } from "@/trpc/routers/app";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function CustomersPage() {
  const trpc = await createAsyncCaller();
  const customers = await trpc.customers.getAll();

  return (
    <div className="container-custom space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Link href="/dashboard/customers/new">
          <Button variant="outline" className="button-custom">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Customer
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <Customer key={customer.id} customer={customer} />
        ))}
      </div>
    </div>
  );
}
