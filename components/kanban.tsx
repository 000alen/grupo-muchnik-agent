"use client";

import React, { useCallback, useReducer, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Column, DroppableColumn } from "@/components/droppable-column";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/draggable-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontal, Plus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Action =
  | {
      type: "moveCard";
      cardId: string;
      columnId: string;
    }
  | {
      type: "addCard";
      columnId: string;
      card: {
        id: string;
        title: string;
        content: string;
      };
    }
  | {
      type: "removeCard";
      cardId: string;
    }
  | {
      type: "addColumn";
      column: Column;
    }
  | {
      type: "removeColumn";
      columnId: string;
    };

const reducer = (state: Column[], action: Action) => {
  switch (action.type) {
    case "moveCard": {
      const { cardId, columnId } = action;
      const card = state
        .flatMap((col) => col.cards)
        .find((c) => c.id === cardId);

      if (!card) return state;

      return state.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: [...col.cards, card],
          };
        }

        return {
          ...col,
          cards: col.cards.filter((c) => c.id !== cardId),
        };
      });
    }

    case "addCard": {
      const { columnId, card } = action;

      return state.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: [...col.cards, card],
          };
        }

        return col;
      });
    }

    case "removeCard": {
      const { cardId } = action;

      return state.map((col) => ({
        ...col,
        cards: col.cards.filter((c) => c.id !== cardId),
      }));
    }

    case "addColumn": {
      const { column } = action;

      return [...state, column];
    }

    case "removeColumn": {
      const { columnId } = action;

      return state.filter((col) => col.id !== columnId);
    }

    default:
      return state;
  }
};

export function Kanban({
  initialColumns = [],
  type = "prospects",
}: {
  initialColumns?: Column[];
  type?: "prospects" | "customers";
}) {
  const router = useRouter();

  const [columns, dispatch] = useReducer(reducer, initialColumns);
  const [activeCardId, setActiveCardId] = useState<number | string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveCardId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveCardId(null);

      if (!event.over) return;

      const currentColumn = columns.find((column) =>
        column.cards.some((card) => card.id === event.active.id)
      );
      if (!currentColumn) return;

      if (event.over.id === currentColumn.id) return;

      dispatch({
        type: "moveCard",
        cardId: event.active.id as string,
        columnId: event.over.id as string,
      });
    },
    [columns]
  );

  const handleCardClick = useCallback((cardId: string) => {
    router.push(`/dashboard/${type}/${cardId}`);
  }, [router, type]);

  const handleConsultantClick = useCallback((consultantId: string) => {
    if (consultantId === "unassigned") return;
    router.push(`/dashboard/consultants/${consultantId}`);
  }, [router]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-none p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground capitalize">
          {type} by Consultant
        </h2>
        <Link href="/dashboard/consultants/new">
          <Button variant="outline" size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            New Consultant
          </Button>
        </Link>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="flex-grow h-[calc(100vh-5rem)]">
          <div className="flex space-x-4 p-4 h-full">
            {columns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className="mb-3">
                  {column.id === "unassigned" ? (
                    <h3 className="text-sm font-medium text-muted-foreground px-2">
                      {column.title}
                    </h3>
                  ) : (
                    <Button
                      variant="ghost"
                      className="text-sm font-medium hover:text-primary w-full justify-start px-2"
                      onClick={() => handleConsultantClick(column.id)}
                    >
                      {column.title}
                    </Button>
                  )}
                </div>
                <DroppableColumn
                  column={column}
                  onCardClick={handleCardClick}
                  getCardMenu={(card) => (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(card.id);
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DragOverlay>
          {activeCardId ? (
            <div className="bg-background p-3 rounded-md shadow-md">
              <h3 className="text-sm font-medium">
                {columns
                  .flatMap((col) => col.cards)
                  .find((card) => card.id === activeCardId)?.title}
              </h3>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
