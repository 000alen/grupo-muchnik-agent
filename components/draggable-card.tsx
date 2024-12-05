import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export interface Card {
  id: string;
  title: string;
  content: string;
}

interface CardProps {
  card: Card;
  className?: string;
  menu?: React.ReactNode;
}

export function Card({ card, className, menu }: CardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "group relative rounded-lg border bg-card p-3 text-card-foreground shadow-sm",
        "hover:border-primary/50 transition-colors",
        isDragging && "opacity-50",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5">
          <h3 className="text-sm font-medium leading-none">{card.title}</h3>
          <p className="text-xs text-muted-foreground">{card.content}</p>
        </div>
        {menu && <div className="flex-shrink-0">{menu}</div>}
      </div>
    </div>
  );
}
