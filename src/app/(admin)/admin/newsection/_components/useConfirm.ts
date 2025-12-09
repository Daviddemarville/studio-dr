"use client";

import { useCallback, useRef, useState } from "react";
import type { MessageType } from "@/types/public";

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<MessageType>({
    title: "",
    message: "",
  });

  // On garde le "resolve" de la Promise ici
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const openConfirm = useCallback((title: string, message: string) => {
    setOptions({ title, message });
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
    setIsOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    options,
    openConfirm,
    confirm: handleConfirm,
    cancel: handleCancel,
  };
}
// const Confirm = useCallback(
//   (title: string, message: string) =>
//     new Promise<boolean>((resolve) => {
//       setOptions({
//         title,
//         message,
//         onConfirm: () => resolve(true),
//       });
//       setIsOpen(true);

//       // Si l’utilisateur ferme sans confirmer
//       const cancel = () => resolve(false);
//       (confirm as any).cancel = cancel;
//     }),
//   [],
// );

// const close = () => {
//   setIsOpen(false);
//   if ((confirm as any).cancel) (confirm as any).cancel();
// };

// return {
//   isOpen,
//   options,
//   openConfirm: confirm,
//   closeConfirm: close,
// };
