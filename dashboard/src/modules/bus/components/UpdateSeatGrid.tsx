import {
  Button,
  Input,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import {
  type Control,
  useFieldArray,
  useWatch,
  useFormState,
} from "react-hook-form";
import type { UpdateBusSchemaType } from "@/schemas/bus/update/update-bus.schema";
import { LuArmchair, LuCircleAlert, LuTrash2 } from "react-icons/lu";
import { MdOutlineCleaningServices, MdOutlineStairs } from "react-icons/md";
import { cn } from "@/utils/cn";

interface UpdateSeatGridProps {
  floorIndex: number;
  control: Control<UpdateBusSchemaType>;
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

export default function UpdateSeatGrid({ floorIndex, control }: UpdateSeatGridProps) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `floors.${floorIndex}.seats`,
  });

  const { errors } = useFormState({
    control,
  });

  const floorErrors = (errors.floors as any)?.[floorIndex]?.seats;

  const rows = useWatch({ control, name: `floors.${floorIndex}.rows` }) || 0;
  const columns =
    useWatch({ control, name: `floors.${floorIndex}.columns` }) || 0;

  const getSeatAt = (row: number, col: number) => {
    return fields.find((s) => s.row === row && s.column === col && s.status !== false);
  };

  const getSeatIndexAt = (row: number, col: number) => {
    return fields.findIndex((s) => s.row === row && s.column === col && s.status !== false);
  };

  const handleCellClick = (row: number, col: number) => {
    const existingIndex = getSeatIndexAt(row, col);
    if (existingIndex === -1) {
      append({
        seatId: 0,
        row,
        column: col,
        typeSeat: "asiento",
        name: "",
        status: true,
      });
    }
  };

  const handleRemove = (seatIndex: number) => {
    const seat = fields[seatIndex];
    if (seat.seatId) {
      update(seatIndex, { ...seat, status: false });
    } else {
      remove(seatIndex);
    }
  };

  const renderCell = (row: number, col: number) => {
    const seat = getSeatAt(row, col);
    const seatIndex = getSeatIndexAt(row, col);
    const seatError =
      floorErrors?.[seatIndex]?.name || floorErrors?.[seatIndex];

    if (!seat) {
      return (
        <div
          key={`${row}-${col}`}
          onClick={() => handleCellClick(row, col)}
          className="w-12 h-12 border-2 border-dashed border-default-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/10 transition-colors"
        >
          <span className="text-[10px] text-default-400 font-mono">
            {row},{col}
          </span>
        </div>
      );
    }

    const typeConfig = SEAT_TYPES.find((t) => t.value === seat.typeSeat);

    return (
      <Popover key={`${row}-${col}`} placement="bottom" showArrow={true}>
        <PopoverTrigger>
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm border-2 relative",
              seat.typeSeat === "asiento" &&
                "bg-success-50 border-success-200 text-success-600 hover:bg-success-100",
              seat.typeSeat === "limpieza" &&
                "bg-warning-50 border-warning-200 text-warning-600 hover:bg-warning-100",
              seat.typeSeat === "escalera" &&
                "bg-danger-50 border-danger-200 text-danger-600 hover:bg-danger-100",
              seatError && "border-danger-500 bg-danger-50 text-danger-600",
            )}
          >
            {seatError && (
              <div className="absolute -top-1 -right-1 bg-danger text-white rounded-full p-0.5 shadow-sm z-10">
                <LuCircleAlert size={10} />
              </div>
            )}
            {typeConfig?.icon}
            {seat.typeSeat === "asiento" && (
              <span
                className={cn(
                  "text-[10px] font-bold mt-0.5",
                  seatError && "text-danger-600",
                )}
              >
                {seat.name || "?"}
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-4 w-64 gap-3 bg-content1 border-default-200">
          <div className="w-full flex flex-col gap-3">
            <p className="text-sm font-semibold border-b pb-2">
              Configurar Celda ({row}, {col})
            </p>

            <Select
              label="Tipo"
              size="sm"
              selectedKeys={[seat.typeSeat]}
              onChange={(e) =>
                update(seatIndex, { ...seat, typeSeat: e.target.value as any })
              }
            >
              {SEAT_TYPES.map((type) => (
                <SelectItem key={type.value} startContent={type.icon}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>

            {seat.typeSeat === "asiento" && (
              <Input
                label="Nombre/Número"
                size="sm"
                placeholder="Ej: 01"
                value={seat.name}
                onChange={(e) =>
                  update(seatIndex, { ...seat, name: e.target.value })
                }
                isInvalid={!!seatError}
                errorMessage={seatError?.message}
              />
            )}

            <Button
              color="danger"
              variant="flat"
              size="sm"
              startContent={<LuTrash2 size={16} />}
              onPress={() => handleRemove(seatIndex)}
            >
              Eliminar Celda
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const grid = [];
  for (let r = 1; r <= rows; r++) {
    const rowCells = [];
    for (let c = 1; c <= columns; c++) {
      rowCells.push(renderCell(r, c));
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
      {rows === 0 || columns === 0 ? (
        <p className="text-center text-default-400 py-10 italic">
          Configura filas y columnas para ver el mapa
        </p>
      ) : (
        <p className="text-center text-[10px] text-default-400 mt-4 uppercase tracking-widest font-semibold">
          FRENTE DEL BUS
        </p>
      )}
    </div>
  );
}
