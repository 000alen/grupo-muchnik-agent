import { Bulletin as BulletinType } from "@/db/app-schema";
import Link from "next/link";

export default function Bulletin({
  bulletin,
  showContent = false,
}: {
  bulletin: BulletinType;
  showContent?: boolean;
}) {
  return (
    <div key={bulletin.id}>
      <h2>{bulletin.id}</h2>

      <Link href={`/dashboard/bulletins/${bulletin.id}`}>View</Link>

      {showContent && <div>{bulletin.content}</div>}
    </div>
  );
}
