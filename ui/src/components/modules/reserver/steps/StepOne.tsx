"use client";
import { useBooking } from "@/context/BookingProvider";
import { AnimatePresence, motion } from "motion/react";
import CardReserver from "../card-reserver/CardReserver";
import { Reserver } from "@/interface/response.interface";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuTriangleAlert, LuX } from "react-icons/lu";
export default function StepOne() {
  const { response, setReserverSelected, setStep } = useBooking();

  const { user } = useAuth();

  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSelect = (reserver: Reserver) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setReserverSelected(reserver);
    setStep(2);
  };

  return (
    <AnimatePresence>
      {response?.reservations?.length ? (
        response.reservations.map((reserver) => (
          <motion.div
            key={reserver.reserverId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-5"
          >
            <CardReserver
              reserver={reserver}
              onSelect={() => {
                setReserverSelected(reserver);
                setStep(2);
              }}
            />
          </motion.div>
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center text-gray-500 mt-10 py-10 bg-white rounded-3xl border border-gray-100"
        >
          No hay viajes disponibles para esta fecha.
        </motion.div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-4xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
            >
              <LuX size={20} />
            </button>

            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <LuTriangleAlert className="text-amber-600 w-10 h-10" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Inicia sesión para continuar
              </h3>
              <p className="text-gray-500 mb-8 px-4 leading-relaxed">
                Para poder seleccionar un viaje y continuar con tu reserva,
                necesitas estar logeado en la plataforma.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/30 transition-all active:scale-95"
                >
                  Ir al Login
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
