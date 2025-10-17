import { useToast as useToastHook } from "../lib/toast";

export const useToast = () => {
  const { toast, currentToast, hideToast } = useToastHook();
  return { toast, currentToast, hideToast };
};
