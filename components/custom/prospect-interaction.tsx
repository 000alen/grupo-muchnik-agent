import { ProspectInteraction as ProspectInteractionType } from "@/db/app-schema";

export default function ProspectInteraction({
  interaction,
}: {
  interaction: ProspectInteractionType;
}) {
  return <div>{interaction.title}</div>;
}
