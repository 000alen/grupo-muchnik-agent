import React from "react";
import { Card } from "@/components/draggable-card";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export interface Column {
  id: string;
  title: string;
  cards: {
    id: string;
    title: string;
    content: string;
  }[];
}

interface DroppableColumnProps {
  column: Column;
  getCardMenu?: (card: Card) => React.ReactNode;
  onCardClick?: (cardId: string) => void;
}

export function DroppableColumn({
  column,
  getCardMenu,
  onCardClick,
}: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg bg-muted/50 p-4 space-y-4 min-h-[200px] w-full",
        isOver && "ring-2 ring-primary/20"
      )}
    >
      <div className="space-y-2">
        {column.cards.map((card) => (
          <div
            key={card.id}
            className="group cursor-pointer"
            onClick={() => onCardClick?.(card.id)}
          >
            <Card
              card={card}
              className={cn(
                "hover:border-primary/50 transition-colors",
                "hover:shadow-md"
              )}
              menu={getCardMenu?.(card)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
