import { type ToasterProps } from "sonner";

import { Toaster } from "@/components/ui/sonner";

const ToasterProvider = () => {
  const toasterConfig: ToasterProps = {
    position: "top-center",
    richColors: true,
    closeButton: process.env.NODE_ENV !== "production",
    gap: 8,
    duration: 2500,
    expand: false,
    visibleToasts: 3,
  };

  return <Toaster {...toasterConfig} />;
};

export default ToasterProvider;
