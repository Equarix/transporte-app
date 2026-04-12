import { createContext, useState, useCallback, type ReactNode } from "react";

export type AlertType = "success" | "alert" | "error";

interface AlertState {
  message: string;
  type: AlertType;
  isVisible: boolean;
}

interface AlertContextType {
  showAlert: (message: string, type?: AlertType) => void;
  hideAlert: () => void;
  alert: AlertState;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AlertContext = createContext<AlertContextType | undefined>(
  undefined,
);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showAlert = useCallback(
    (message: string, type: AlertType = "success") => {
      setAlert({
        message,
        type,
        isVisible: true,
      });

      setTimeout(() => {
        setAlert((prev) => ({ ...prev, isVisible: false }));
      }, 3000);
    },
    [],
  );

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alert }}>
      {children}
    </AlertContext.Provider>
  );
};
