import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, DraggableCard } from "@/components/draggable-card";
import { useDroppable } from "@dnd-kit/core";

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export const DroppableColumn = ({
  column,
  getCardMenu,
}: {
  column: Column;
  getCardMenu?: (card: Card) => React.ReactNode;
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      key={column.id}
      className="flex-shrink-0 w-[280px] flex flex-col h-full"
    >
      <h2 className="font-medium mb-3 text-muted-foreground">{column.title}</h2>
      <ScrollArea className="flex-grow rounded-md bg-muted/50 p-2">
        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <DraggableCard
              key={card.id}
              card={card}
              columnId={column.id}
              getCardMenu={getCardMenu}
            />
          ))}
        </SortableContext>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      {/* <Button
        variant="ghost"
        size="sm"
        className="w-full mt-2 text-muted-foreground hover:text-foreground justify-start px-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a card
      </Button> */}
    </div>
  );
};
