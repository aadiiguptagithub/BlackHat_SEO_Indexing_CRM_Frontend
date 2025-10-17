import { useToast } from "../hooks/use-toast";
import { Toast } from "./toast";

export function ToastContainer() {
  const { currentToast, hideToast } = useToast();

  if (!currentToast) return null;

  return (
    <Toast
      message={currentToast.message}
      type={currentToast.type}
      onClose={hideToast}
    />
  );
}
