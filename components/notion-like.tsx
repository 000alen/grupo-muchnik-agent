"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface BaseBlock {
  id: string;
  type: string;
  content: React.ReactNode;
}

interface TitleBlock extends BaseBlock {
  type: "title";
}

interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
}

interface ToggleBlock extends BaseBlock {
  type: "toggle";
  title: string;
  isExpanded: boolean;
}

export type Block = TitleBlock | ParagraphBlock | ToggleBlock;

const mockBlocks: Block[] = [
  {
    id: "1",
    type: "toggle",
    title: "Study Guide",
    content: (
      <>
        <ul className="list-disc pl-6 space-y-2">
          <li>startup is an experiment</li>
          <li>most startups fail</li>
        </ul>
        <p className="mt-4 font-semibold">Frederick Winslow Taylor:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>inventions became ubiquitous</li>
          <li>bonus if you can do your work better</li>
          <li>
            soldiering: do work as slow as possible so no one gets in trouble
          </li>
        </ul>
        <p className="mt-4 italic">
          &quot;The customer is the most important part of the production
          line&quot; (Deming)
        </p>
      </>
    ),
    isExpanded: true,
  },
  {
    id: "2",
    type: "toggle",
    title: "1. Entrepreneurial Management",
    content: <p>Content for Entrepreneurial Management</p>,
    isExpanded: false,
  },
  {
    id: "3",
    type: "toggle",
    title: "2. Waterfall Model",
    content: <p>Content for Waterfall Model</p>,
    isExpanded: false,
  },
  {
    id: "4",
    type: "toggle",
    title: "3. Agile Product Development",
    content: <p>Content for Agile Product Development</p>,
    isExpanded: false,
  },
];

const TitleBlock = ({ block }: { block: TitleBlock }) => {
  return <h1 className="text-4xl font-bold mb-6">{block.content}</h1>;
};

const ParagraphBlock = ({ block }: { block: ParagraphBlock }) => {
  return <p>{block.content}</p>;
};

const ToggleBlock = ({ block }: { block: ToggleBlock }) => {
  const [isExpanded, setIsExpanded] = useState(block.isExpanded);

  return (
    <div className="mb-4">
      <Button
        variant="ghost"
        className="w-full justify-start p-0 font-semibold text-lg"
        onClick={() => setIsExpanded((e) => !e)}
      >
        {isExpanded ? (
          <ChevronDown className="mr-2 h-4 w-4" />
        ) : (
          <ChevronRight className="mr-2 h-4 w-4" />
        )}
        {block.title}
      </Button>
      {isExpanded && <div className="mt-2 pl-6">{block.content}</div>}
    </div>
  );
};

function renderBlock(block: Block) {
  switch (block.type) {
    case "title":
      return <TitleBlock key={block.id} block={block} />;
    case "paragraph":
      return <ParagraphBlock key={block.id} block={block} />;
    case "toggle":
      return <ToggleBlock key={block.id} block={block} />;
  }
}

export function NotionLike({ blocks = mockBlocks }: { blocks?: Block[] }) {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-background text-foreground">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        {blocks.map(renderBlock)}
      </ScrollArea>
    </div>
  );
}
