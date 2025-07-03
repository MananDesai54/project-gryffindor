import { toast } from "sonner";

export const Notify = (title: string, description?: string) =>
  toast.info(title, {
    description,
    position: "bottom-center",
    duration: 3000,
    dismissible: true,
  });

export const NotifyError = (title: string, description?: string) =>
  toast.error(title, {
    description: description,
    position: "bottom-center",
    duration: 3000,
    dismissible: true,
    richColors: true,
  });

export const NotifySuccess = (title: string, description?: string) =>
  toast.success(title, {
    description: description,
    position: "bottom-center",
    duration: 3000,
    dismissible: true,
    richColors: true,
  });

export const NotifyWarning = (title: string, description?: string) =>
  toast.warning(title, {
    description: description,
    position: "bottom-center",
    duration: 3000,
    dismissible: true,
    richColors: true,
  });
