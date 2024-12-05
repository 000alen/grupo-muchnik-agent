import { Prospect as ProspectType } from "@/db/app-schema";
import Link from "next/link";

export default function Prospect({ prospect }: { prospect: ProspectType }) {
  return (
    <div key={prospect.id}>
      <h2>{prospect.companyName}</h2>
      <Link href={`/dashboard/prospects/${prospect.id}`}>View</Link>
    </div>
  );
}
