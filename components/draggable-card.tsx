import React from "react";
import { useDraggable } from "@dnd-kit/core";

export interface Card {
  id: string;
  title: string;
  content: string;
}

export const DraggableCard = ({
  card,
  columnId,
  getCardMenu,
}: {
  card: Card;
  columnId: string;
  getCardMenu?: (card: Card) => React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: card.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="bg-background p-3 rounded-md shadow-sm mb-2 hover:shadow-md transition-shadow group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium">{card.title}</h3>
        {getCardMenu && getCardMenu(card)}
      </div>
      <p className="text-sm text-muted-foreground">{card.content}</p>
    </div>
  );
};
