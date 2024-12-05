import { Contact as ContactType } from "@/db/app-schema";

export default function Contact({ contact }: { contact: ContactType }) {
  return (
    <div key={contact.id}>
      <h2>{contact.name}</h2>
    </div>
  );
}
