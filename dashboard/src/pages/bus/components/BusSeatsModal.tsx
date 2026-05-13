import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Tabs,
  Tab,
  Chip,
} from "@heroui/react";
import type { ResponseBus, Floor, Seat } from "@/interface/response.interface";
import { LuArmchair } from "react-icons/lu";
import { MdOutlineCleaningServices, MdOutlineStairs } from "react-icons/md";
import { cn } from "@/utils/cn";

interface BusSeatsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  bus: ResponseBus | null;
}

const SEAT_TYPES = [
  {
    value: "asiento",
    label: "Asiento",
    icon: <LuArmchair size={16} />,
    color: "success",
  },
  {
    value: "limpieza",
    label: "Limpieza",
    icon: <MdOutlineCleaningServices size={16} />,
    color: "warning",
  },
  {
    value: "escalera",
    label: "Escalera",
    icon: <MdOutlineStairs size={16} />,
    color: "danger",
  },
] as const;

export default function BusSeatsModal({
  isOpen,
  onOpenChange,
  bus,
}: BusSeatsModalProps) {
  if (!bus) return null;

  const renderSeat = (seat: Seat) => {
    const typeConfig = SEAT_TYPES.find((t) => t.value === seat.typeSeat);

    return (
      <div
        key={seat.seatId}
        className={cn(
          "w-12 h-12 rounded-lg flex flex-col items-center justify-center transition-all shadow-sm border-2 relative",
          seat.typeSeat === "asiento" &&
            "bg-success-50 border-success-200 text-success-600",
          seat.typeSeat === "limpieza" &&
            "bg-warning-50 border-warning-200 text-warning-600",
          seat.typeSeat === "escalera" &&
            "bg-danger-50 border-danger-200 text-danger-600",
        )}
      >
        {typeConfig?.icon}
        {seat.typeSeat === "asiento" && (
          <span className="text-[10px] font-bold mt-0.5">{seat.name}</span>
        )}
      </div>
    );
  };

  const renderFloor = (floor: Floor) => {
    const grid = [];
    for (let r = 1; r <= floor.rows; r++) {
      const rowCells = [];
      for (let c = 1; c <= floor.columns; c++) {
        const seat = floor.seats.find((s) => s.row === r && s.column === c);
        if (seat) {
          rowCells.push(renderSeat(seat));
        } else {
          rowCells.push(
            <div
              key={`empty-${r}-${c}`}
              className="w-12 h-12 border-2 border-dashed border-default-200 rounded-lg flex items-center justify-center opacity-20"
            />,
          );
        }
      }
      grid.push(
        <div key={`row-${r}`} className="flex gap-2 justify-center">
          {rowCells}
        </div>,
      );
    }

    return (
      <div className="flex flex-col gap-2 p-6 bg-default-50 rounded-xl border border-default-200 overflow-auto max-h-[500px]">
        <div className="flex flex-col gap-2 min-w-max mx-auto">{grid}</div>
        <p className="text-center text-[10px] text-default-400 mt-4 uppercase tracking-widest font-semibold">
          FRENTE DEL BUS
        </p>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span>Asientos del Bus - {bus.plate}</span>
                <Chip size="sm" variant="flat" color="primary">
                  {bus.model}
                </Chip>
              </div>
            </ModalHeader>
            <ModalBody className="pb-8">
              <Tabs
                aria-label="Pisos del bus"
                fullWidth
                color="primary"
                variant="underlined"
              >
                {bus.floors
                  .sort((a, b) => a.order - b.order)
                  .map((floor) => (
                    <Tab key={floor.floorId} title={floor.name}>
                      {renderFloor(floor)}
                    </Tab>
                  ))}
              </Tabs>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
