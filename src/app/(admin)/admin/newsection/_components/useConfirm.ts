"use client";

import { useState, useCallback } from "react";

export function useConfirm() {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<{
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({
        title: "",
        message: "",
    });

    const confirm = useCallback(
        (title: string, message: string) =>
            new Promise<boolean>((resolve) => {
                setOptions({
                    title,
                    message,
                    onConfirm: () => resolve(true),
                });
                setIsOpen(true);

                // Si l’utilisateur ferme sans confirmer
                const cancel = () => resolve(false);
                (confirm as any).cancel = cancel;
            }),
        [],
    );

    const close = () => {
        setIsOpen(false);
        if ((confirm as any).cancel) (confirm as any).cancel();
    };

    return {
        isOpen,
        options,
        openConfirm: confirm,
        closeConfirm: close,
    };
}
