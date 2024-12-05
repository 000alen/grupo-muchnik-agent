import { Customer as CustomerType } from "@/db/app-schema";
import Link from "next/link";

export default function Customer({ customer }: { customer: CustomerType }) {
  return (
    <div key={customer.id}>
      <h2>{customer.name}</h2>
      <Link href={`/dashboard/customers/${customer.id}`}>View</Link>
    </div>
  );
}
