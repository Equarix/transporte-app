import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Image,
} from "@heroui/react";
import type { ResponseReserver } from "@/interface/response.interface";
import {
  LuDollarSign,
  LuStore,
  LuUser,
  LuCalendar,
  LuMapPin,
  LuBus,
  LuInfo,
  LuClock,
} from "react-icons/lu";
import { format } from "date-fns";
import { ENV } from "@/config/env";

interface DetailReserverModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reserver: ResponseReserver | null;
}

export default function DetailReserverModal({
  isOpen,
  onOpenChange,
  reserver,
}: DetailReserverModalProps) {
  if (!reserver) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 py-6 px-8 border-b border-default-100">
              <span className="text-xl font-bold">
                Detalle de Reserva #{reserver.reserverId}
              </span>
              <span className="text-small text-default-400 font-normal">
                Registrado por: {reserver.registerUser.profile.firstName}{" "}
                {reserver.registerUser.profile.lastName}
              </span>
            </ModalHeader>
            <ModalBody className="py-8 px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <LuInfo size={18} />
                    <span>Información General</span>
                  </div>
                  <div className="bg-default-50 p-4 rounded-2xl border border-default-200 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-default-400">
                        <LuCalendar size={18} />
                      </div>
                      <div>
                        <p className="text-tiny text-default-400">
                          Fecha de Viaje
                        </p>
                        <p className="text-small font-medium">
                          {format(reserver.date, "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-default-400">
                        <LuClock size={18} />
                      </div>
                      <div>
                        <p className="text-tiny text-default-400">Hora de Salida</p>
                        <p className="text-small font-medium">
                          {reserver.checkOutHour || "--:--"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-default-400">
                        <LuBus size={18} />
                      </div>
                      <div>
                        <p className="text-tiny text-default-400">Bus</p>
                        <p className="text-small font-medium">
                          {reserver.bus.plate}{" "}
                          <span className="text-default-400 font-normal">
                            ({reserver.bus.model})
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-default-400">
                        <LuUser size={18} />
                      </div>
                      <div>
                        <p className="text-tiny text-default-400">Conductor</p>
                        <p className="text-small font-medium">
                          {reserver.driver.firstName} {reserver.driver.lastName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <LuMapPin size={18} />
                    <span>Ruta del Viaje</span>
                  </div>
                  <div className="bg-default-50 p-5 rounded-2xl border border-default-200 relative">
                    <div className="absolute left-[27px] top-[45px] bottom-[45px] w-0.5 bg-gradient-to-b from-success to-danger opacity-30" />
                    <div className="space-y-8">
                      <div className="flex items-start gap-4 relative z-10">
                        <div className="size-3 rounded-full bg-success ring-4 ring-success/20 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-tiny text-default-400">
                            Origen (Check In)
                          </p>
                          <p className="text-small font-semibold">
                            {reserver.checkIn.name}
                          </p>
                          <p className="text-tiny text-default-400 line-clamp-1">
                            {reserver.checkIn.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 relative z-10">
                        <div className="size-3 rounded-full bg-danger ring-4 ring-danger/20 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-tiny text-default-400">
                            Destino (Check Out)
                          </p>
                          <p className="text-small font-semibold">
                            {reserver.checkOut.name}
                          </p>
                          <p className="text-tiny text-default-400 line-clamp-1">
                            {reserver.checkOut.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Divider className="my-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Prices */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold underline decoration-primary/20 decoration-2 underline-offset-4">
                    <LuDollarSign size={18} />
                    <span>Precios por Piso</span>
                  </div>
                  <div className="space-y-2.5">
                    {reserver.reserverPriceFloors.map((pf, idx) => (
                      <div
                        key={pf.reserverPriceFloorId}
                        className="flex items-center justify-between p-4 bg-white border border-default-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary-50 text-primary flex items-center justify-center text-tiny font-bold uppercase">
                            F{idx + 1}
                          </div>
                          <span className="text-small font-medium">
                            Piso {idx + 1}
                          </span>
                        </div>
                        <span className="text-primary font-bold text-lg">
                          S/ {pf.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {reserver.reserverPriceFloors.length === 0 && (
                      <div className="p-8 text-center bg-default-50 rounded-2xl border border-dashed border-default-200">
                        <p className="text-tiny text-default-400 italic">
                          No hay precios configurados.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Agencies */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold underline decoration-primary/20 decoration-2 underline-offset-4">
                    <LuStore size={18} />
                    <span>Agencias Vinculadas</span>
                  </div>
                  <div className="space-y-3">
                    {reserver.reserverAgencies.map((ra) => (
                      <div
                        key={ra.reserverAgencyId}
                        className="flex items-center gap-4 p-3 bg-white border border-default-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="size-14 rounded-xl overflow-hidden bg-default-100 shrink-0 border border-default-200">
                          {ra.agency?.galery?.imageUrl ? (
                            <Image
                              src={ENV.API_URL + ra.agency.galery.imageUrl}
                              alt={ra.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-default-300">
                              <LuStore size={24} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-small font-bold truncate text-default-700">
                            {ra.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-tiny text-default-400">
                            <LuMapPin size={12} className="shrink-0" />
                            <p className="truncate">{ra.address}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {reserver.reserverAgencies.length === 0 && (
                      <div className="p-8 text-center bg-default-50 rounded-2xl border border-dashed border-default-200">
                        <p className="text-tiny text-default-400 italic">
                          No hay agencias vinculadas.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-default-100 p-6">
              <Button
                color="primary"
                variant="solid"
                className="px-8 font-semibold shadow-lg shadow-primary/20"
                onPress={onClose}
              >
                Entendido
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
