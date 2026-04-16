import Header from "@/components/layouts/header/Header";
import Container from "@/components/ui/container/Container";
import FormSection from "@/components/ui/form/FormSection";
import InputDate from "@/components/ui/input-date/InputDate";
import Load from "@/components/ui/load/Load";
import { useCreateReservers } from "@/modules/reservers/hooks/useCreateReservers";
import { parseErrors } from "@/utils/parseErrors";
import { cn, Form, Select, SelectItem } from "@heroui/react";
import { Controller } from "react-hook-form";
import { LuInfo, LuPlus } from "react-icons/lu";

export default function CreateReservers() {
  const {
    form: {
      formState: { errors },
      control,
    },
    handleSubmit,
    drivers: { resDrivers },
    bus: { resBus },
    destination: { resDestination },
    isLoading,
  } = useCreateReservers();

  return (
    <Form
      onSubmit={handleSubmit}
      className="w-full"
      validationErrors={parseErrors(errors)}
    >
      <Load loading={isLoading} />

      <Container className="mx-auto space-y-2">
        <Header
          text={{
            header: "Crear Reserva",
            button: "Crear",
          }}
          icon={<LuPlus className="size-5" />}
          type="submit"
          className={{
            button: "px-8 h-12 shadow-md hover:shadow-lg transition-all",
          }}
        />

        <div className="flex flex-col gap-8">
          <FormSection
            title="Informacion de la reserva"
            description="Informacion de la reserva"
            icon={<LuInfo className="size-5" />}
            className="overflow-visible"
            contentClassName="overflow-visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <Controller
                control={control}
                name="busId"
                render={({ field: { value, onChange } }) => (
                  <Select
                    label="Bus"
                    placeholder="Seleccione un bus"
                    className={cn(!!errors.busId && "mt-0")}
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    isInvalid={!!errors.busId}
                    errorMessage={errors.busId?.message}
                    items={resBus?.body ?? []}
                    selectedKeys={value ? [String(value)] : []}
                    onChange={(e) => {
                      onChange(Number(e.target.value));
                    }}
                  >
                    {(item) => (
                      <SelectItem key={item.busId} textValue={item.plate}>
                        {item.plate}
                      </SelectItem>
                    )}
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="driverId"
                render={({ field: { value, onChange } }) => (
                  <Select
                    label="Conductor"
                    placeholder="Seleccione un conductor"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="max-w-full"
                    isInvalid={!!errors.driverId}
                    errorMessage={errors.driverId?.message}
                    items={resDrivers?.body ?? []}
                    selectedKeys={value ? [String(value)] : []}
                    onChange={(e) => onChange(Number(e.target.value))}
                  >
                    {(item) => (
                      <SelectItem
                        key={item.userId}
                        textValue={item.firstName + " " + item.lastName}
                      >
                        {item.firstName + " " + item.lastName}
                      </SelectItem>
                    )}
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="checkInId"
                render={({ field: { value, onChange } }) => (
                  <Select
                    label="Check In"
                    placeholder="Seleccione un check in"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="max-w-full"
                    isInvalid={!!errors.checkInId}
                    errorMessage={errors.checkInId?.message}
                    items={resDestination?.body ?? []}
                    selectedKeys={value ? [String(value)] : []}
                    onChange={(e) => onChange(Number(e.target.value))}
                  >
                    {(item) => (
                      <SelectItem
                        key={item.destinationId}
                        textValue={item.name}
                      >
                        {item.name}
                      </SelectItem>
                    )}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="checkOutId"
                render={({ field: { value, onChange } }) => (
                  <Select
                    label="Check Out"
                    placeholder="Seleccione un check out"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="max-w-full"
                    isInvalid={!!errors.checkOutId}
                    errorMessage={errors.checkOutId?.message}
                    items={resDestination?.body ?? []}
                    selectedKeys={value ? [String(value)] : []}
                    onChange={(e) => onChange(Number(e.target.value))}
                  >
                    {(item) => (
                      <SelectItem
                        key={item.destinationId}
                        textValue={item.name}
                      >
                        {item.name}
                      </SelectItem>
                    )}
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                  <InputDate
                    label="Fecha"
                    value={value}
                    onChange={(date) => {
                      onChange(date);
                    }}
                  />
                )}
              />
            </div>
          </FormSection>
        </div>
      </Container>
    </Form>
  );
}
