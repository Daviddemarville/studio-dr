"use client";

import { useMemo, useState } from "react";
import type { InitialMessagesType } from "@/types/public";
import FilterBar from "./FilterBar";
import MessageDrawer from "./MessageDrawer";
import MessageList from "./MessageList";

export default function ClientWrapper({
  initialMessages,
}: InitialMessagesType) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const messages = useMemo(() => {
    return filter === "all"
      ? initialMessages
      : initialMessages.filter((m) => !m.is_read);
  }, [filter, initialMessages]);

  const currentIndex = messages.findIndex((m) => m.id === currentId);
  const currentMessage = messages[currentIndex] || null;

  const openDrawer = (id: string) => {
    setCurrentId(id);
    setDrawerOpen(true);
  };

  const prev = () => {
    if (currentIndex > 0) setCurrentId(messages[currentIndex - 1].id);
  };

  const next = () => {
    if (currentIndex < messages.length - 1)
      setCurrentId(messages[currentIndex + 1].id);
  };

  return (
    <>
      <FilterBar filter={filter} setFilter={setFilter} />

      <MessageList messages={messages} onOpen={openDrawer} />

      <MessageDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        message={currentMessage}
        onPrev={prev}
        onNext={next}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < messages.length - 1}
      />
    </>
  );
}
