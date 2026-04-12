import { useAlert } from "@/hooks/useAlert";
import { motion, AnimatePresence } from "framer-motion";
import { LuCircleCheck, LuTriangleAlert, LuCircleX, LuX } from "react-icons/lu";

const GlobalAlert = () => {
  const { alert, hideAlert } = useAlert();

  const config = {
    success: {
      icon: <LuCircleCheck className="text-success" size={24} />,
      bg: "bg-success-50",
      border: "border-success-200",
      text: "text-success-700",
    },
    alert: {
      icon: <LuTriangleAlert className="text-warning" size={24} />,
      bg: "bg-warning-50",
      border: "border-warning-200",
      text: "text-warning-700",
    },
    error: {
      icon: <LuCircleX className="text-danger" size={24} />,
      bg: "bg-danger-50",
      border: "border-danger-200",
      text: "text-danger-700",
    },
  };

  const currentConfig = config[alert.type];

  return (
    <AnimatePresence>
      {alert.isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-100 w-full max-w-md px-4"
        >
          <div
            className={`${currentConfig.bg} ${currentConfig.border} border-1 rounded-xl p-4 shadow-lg flex items-center gap-3`}
          >
            <div className="shrink-0">{currentConfig.icon}</div>
            <div className={`flex-1 font-medium ${currentConfig.text}`}>
              {alert.message}
            </div>
            <button
              onClick={hideAlert}
              className={`p-1 hover:bg-black/5 rounded-full transition-colors ${currentConfig.text}`}
              aria-label="Cerrar alerta"
            >
              <LuX size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalAlert;
