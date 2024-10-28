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
import { MoreHorizontal, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const mockColumns = [
  {
    id: "todo",
    title: "To Do",
    cards: [
      {
        id: "task1",
        title: "Project Plan",
        content: "Create a comprehensive project plan",
      },
      {
        id: "task2",
        title: "UI Mockups",
        content: "Design user interface mockups for the new feature",
      },
      {
        id: "task7",
        title: "Research",
        content: "Conduct market research for the new product",
      },
      {
        id: "task8",
        title: "Budget Review",
        content: "Review and adjust the project budget",
      },
      {
        id: "task9",
        title: "Team Meeting",
        content: "Schedule and prepare for the weekly team meeting",
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    cards: [
      {
        id: "task3",
        title: "Landing Page",
        content: "Develop the main landing page for the website",
      },
      {
        id: "task10",
        title: "API Integration",
        content: "Integrate the new API endpoints with the frontend",
      },
      {
        id: "task11",
        title: "Database Optimization",
        content: "Optimize database queries for better performance",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      {
        id: "task4",
        title: "Repository Setup",
        content: "Set up the project repository and initial codebase",
      },
      {
        id: "task12",
        title: "User Authentication",
        content: "Implement user authentication system",
      },
      {
        id: "task13",
        title: "Email Templates",
        content: "Design and code email templates for notifications",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    cards: [
      {
        id: "task5",
        title: "Code Review",
        content: "Perform a thorough code review of the latest pull request",
      },
      {
        id: "task14",
        title: "Documentation",
        content: "Review and update project documentation",
      },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    cards: [
      {
        id: "task6",
        title: "Unit Tests",
        content: "Write and run unit tests for the core functionality",
      },
      {
        id: "task15",
        title: "Integration Tests",
        content: "Develop and execute integration tests",
      },
      {
        id: "task16",
        title: "User Acceptance Testing",
        content: "Conduct UAT with key stakeholders",
      },
    ],
  },
];

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
  initialColumns = mockColumns,
}: {
  initialColumns?: Column[];
  getCardMenu?: (card: Card) => React.ReactNode;
}) {
  const router = useRouter();

  const [columns, dispatch] = useReducer(reducer, initialColumns);
  const [activeCardId, setActiveCardId] = useState<number | string | null>(
    null
  );

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

      console.log("here", { current: currentColumn.id, over: event.over.id });

      dispatch({
        type: "moveCard",
        cardId: event.active.id as string,
        columnId: event.over.id as string,
      });
    },
    [columns]
  );

  const addColumn = () => {
    dispatch({
      type: "addColumn",
      column: {
        id: `column-${columns.length}`,
        title: "New Column",
        cards: [],
      },
    });
  };

  const getCardMenu = (card: Card) => {
    return (
      <DropdownMenu key={card.id}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/crm/profiles/${card.id}`);
            }}
          >
            Open
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-none p-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Grupo Muchnik GPT
        </h1>
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
              <DroppableColumn
                key={column.id}
                column={column}
                getCardMenu={getCardMenu}
              />
            ))}

            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-muted-foreground hover:text-foreground justify-start px-2"
              onClick={addColumn}
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>New column</span>
            </Button>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DragOverlay>
          {activeCardId ? (
            <div className="bg-background p-3 rounded-md shadow-md">
              <h3 className="text-sm font-medium">
                {
                  columns
                    .flatMap((col) => col.cards)
                    .find((card) => card.id === activeCardId)?.title
                }
              </h3>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
