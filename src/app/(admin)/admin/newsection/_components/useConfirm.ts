"use client";

import { useCallback, useRef, useState } from "react";
import type { ConfirmOptionsType } from "@/types/public";

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptionsType>({
    title: "",
    message: "",
  });

  const cancelRef = useRef<(() => void) | null>(null);

  const openConfirm = useCallback(
    (title: string, message: string) =>
      new Promise<boolean>((resolve) => {
        setOptions({
          title,
          message,
          onConfirm: () => {
            resolve(true);
            cancelRef.current = null;
          },
        });

        // Si l'utilisateur ferme sans confirmer
        cancelRef.current = () => {
          resolve(false);
          cancelRef.current = null;
        };
        setIsOpen(true);
      }),
    [],
  );

  const closeConfirm = useCallback(() => {
    setIsOpen(false);
    if (cancelRef.current) {
      cancelRef.current();
    }
  }, []);

  return {
    isOpen,
    options,
    openConfirm,
    closeConfirm,
  };
}
