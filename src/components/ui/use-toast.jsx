import { useToast as useToastPrimitive } from "@radix-ui/react-toast";
import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description }) => {
    const id = Math.random().toString(36).slice(2);
    const newToast = { id, title, description };

    setToasts((currentToasts) => [...currentToasts, newToast]);

    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      );
    }, 5000);
  }, []);

  return { toast, toasts };
}
