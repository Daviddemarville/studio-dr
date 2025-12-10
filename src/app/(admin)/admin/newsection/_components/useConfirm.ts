"use client";

import { useCallback, useRef, useState } from "react";
import type { ConfirmOptions, ConfirmResult } from "@/types/newsection";

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);

  // Options visibles dans le modal
  const [options, setOptions] = useState<ConfirmOptions>({
    title: "",
    message: "",
  });

  // La fonction qui va résoudre la promesse
  type Resolver = ((value: ConfirmResult) => void) | undefined;
  const resolverRef = useRef<Resolver>(undefined);

  // Ouvre le modal et retourne une promesse
  const openConfirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise<ConfirmResult>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const confirm = () => {
    resolverRef.current?.(true);
    resolverRef.current = undefined;
    setIsOpen(false);
  };

  const cancel = () => {
    resolverRef.current?.(false);
    resolverRef.current = undefined;
    setIsOpen(false);
  };

  return {
    isOpen,
    options,
    openConfirm,
    confirm,
    cancel,
  };
}
