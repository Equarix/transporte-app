import Header from "@/components/layouts/header/Header";
import Container from "@/components/ui/container/Container";
import FormSection from "@/components/ui/form/FormSection";
import Load from "@/components/ui/load/Load";
import { useCreateBus } from "@/modules/bus/hooks/useCreateBus";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Tooltip,
  Card,
  CardBody,
} from "@heroui/react";
import {
  LuSave,
  LuBus,
  LuPlus,
  LuTrash2,
  LuInfo,
  LuLayers,
  LuHash,
} from "react-icons/lu";
import { useNavigate } from "react-router";
import { useFieldArray, type Control } from "react-hook-form";
import SeatGrid from "./components/SeatGrid";
import type { CreateBusSchemaType } from "@/schemas/bus/bus.schema";

const BUS_TYPES = [
  { value: "semicama", label: "Semicama" },
  { value: "cama", label: "Cama" },
  { value: "presidencial", label: "Presidencial" },
];

export default function CreateBus() {
  const navigate = useNavigate();
  const { form, onSubmit, isPending } = useCreateBus();

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "floors",
  });

  const floors = watch("floors");

  // Calculate total seats
  const totalSeats = (floors || []).reduce((acc, floor) => {
    return (
      acc + (floor.seats?.filter((s) => s.typeSeat === "asiento").length || 0)
    );
  }, 0);

  // Sync capacity with seats
  const handleSyncCapacity = () => {
    setValue("capacity", totalSeats);
  };

  return (
    <Container className="pb-20">
      <Load loading={isPending} />

      <form onSubmit={onSubmit} className="space-y-8">
        <Header
          text={{
            header: "Crear Nuevo Bus",
            button: "Crear",
          }}
        />
        {/* General Information */}
        <FormSection
          title="Información General"
          description="Datos básicos de identificación del vehículo"
          icon={<LuBus size={20} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Nombre del Bus"
              placeholder="Ej: Bus 101"
              variant="bordered"
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
            <Input
              label="Placa / Matrícula"
              placeholder="Ej: ABC-123"
              variant="bordered"
              {...register("plate")}
              isInvalid={!!errors.plate}
              errorMessage={errors.plate?.message}
            />
            <Input
              label="Modelo"
              placeholder="Ej: Mercedes-Benz O500"
              variant="bordered"
              {...register("model")}
              isInvalid={!!errors.model}
              errorMessage={errors.model?.message}
            />
            <Input
              type="number"
              label="Año de Fabricación"
              placeholder="2024"
              variant="bordered"
              {...register("year", { valueAsNumber: true })}
              isInvalid={!!errors.year}
              errorMessage={errors.year?.message}
            />
            <Select
              label="Tipo de Bus"
              placeholder="Selecciona un tipo"
              variant="bordered"
              {...register("type")}
              isInvalid={!!errors.type}
              errorMessage={errors.type?.message}
            >
              {BUS_TYPES.map((type) => (
                <SelectItem key={type.value}>{type.label}</SelectItem>
              ))}
            </Select>
            <Input
              type="number"
              label="Capacidad Total"
              placeholder="0"
              variant="bordered"
              {...register("capacity", { valueAsNumber: true })}
              isInvalid={!!errors.capacity}
              errorMessage={errors.capacity?.message}
              endContent={
                <Tooltip content="Sincronizar con mapa de asientos">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={handleSyncCapacity}
                  >
                    <LuHash size={14} />
                  </Button>
                </Tooltip>
              }
              description={`Asientos configurados: ${totalSeats}`}
            />
          </div>
        </FormSection>

        {/* Floors and Seats Configuration */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LuLayers className="text-primary" size={24} />
              <h2 className="text-xl font-bold">Configuración de Pisos</h2>
            </div>
            <Button
              color="primary"
              variant="flat"
              startContent={<LuPlus />}
              onPress={() =>
                append({
                  name: `Piso ${fields.length + 1}`,
                  order: fields.length + 1,
                  rows: 5,
                  columns: 4,
                  seats: [],
                })
              }
            >
              Agregar Piso
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card
              key={field.id}
              className="border-none shadow-sm bg-content1/50 overflow-visible"
            >
              <CardBody className="p-0">
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-default-100">
                  {/* Floor Settings */}
                  <div className="p-6 md:w-1/3 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">Piso {index + 1}</h3>
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        size="sm"
                        isDisabled={fields.length === 1}
                        onPress={() => remove(index)}
                      >
                        <LuTrash2 size={18} />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Nombre del Piso"
                        size="sm"
                        variant="bordered"
                        {...register(`floors.${index}.name`)}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="number"
                          label="Filas"
                          size="sm"
                          variant="bordered"
                          {...register(`floors.${index}.rows`, {
                            valueAsNumber: true,
                          })}
                        />
                        <Input
                          type="number"
                          label="Columnas"
                          size="sm"
                          variant="bordered"
                          {...register(`floors.${index}.columns`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>

                      <div className="p-4 bg-primary-50 rounded-lg border border-primary-100 text-primary-700">
                        <div className="flex gap-2 items-start">
                          <LuInfo className="shrink-0 mt-0.5" size={16} />
                          <p className="text-xs leading-relaxed">
                            Define el tamaño de la cuadrícula y haz clic en las
                            celdas para agregar asientos, escaleras o áreas de
                            limpieza.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seat Grid */}
                  <div className="p-6 md:w-2/3 bg-default-50/50">
                    <SeatGrid
                      floorIndex={index}
                      control={
                        control as unknown as Control<CreateBusSchemaType>
                      }
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="flat"
            color="danger"
            onPress={() => navigate("/bus")}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            color="primary"
            className="px-8 shadow-lg shadow-primary/20 font-bold"
            startContent={<LuSave />}
            isLoading={isPending}
          >
            Guardar Bus
          </Button>
        </div>
      </form>
    </Container>
  );
}
