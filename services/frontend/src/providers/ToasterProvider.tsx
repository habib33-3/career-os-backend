import { Toaster, type ToasterProps } from "sonner";

const ToasterProvider = () => {
  const toasterConfig: ToasterProps = {
    position: "top-center",
    richColors: true,
    closeButton: process.env.NODE_ENV !== "production",
    gap: 8,
    duration: 2500,
    expand: false,
    visibleToasts: 3,
    theme: "system", //TODO: make this dynamic based on user preference
  };

  return <Toaster {...toasterConfig} />;
};

export default ToasterProvider;
