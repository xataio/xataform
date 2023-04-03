import { toast } from "react-toastify";

export function useCopyToClipboard() {
  const copy = async (text: string, label?: string) => {
    if (!navigator?.clipboard) {
      toast.warn("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label ?? text} copied`);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.warn("Copy failed:" + error.message);
      }
      return false;
    }
  };

  return { copy };
}
