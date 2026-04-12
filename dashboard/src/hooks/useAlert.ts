import { AlertContext } from "@/components/providers/AlertContext";
import { useContext } from "react";

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
