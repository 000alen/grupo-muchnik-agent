import { Consultant as ConsultantType } from "@/db/app-schema";
import Link from "next/link";

export default function Consultant({
  consultant,
}: {
  consultant: ConsultantType;
}) {
  return (
    <div key={consultant.id}>
      <h2>{consultant.name}</h2>
      <Link href={`/dashboard/consultants/${consultant.id}`}>View</Link>
    </div>
  );
}
