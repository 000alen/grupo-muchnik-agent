import { CustomerInteraction as CustomerInteractionType } from "@/db/app-schema";

export default function CustomerInteraction({
  interaction,
}: {
  interaction: CustomerInteractionType;
}) {
  return <div>{interaction.title}</div>;
}
