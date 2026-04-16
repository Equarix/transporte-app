import Header from "@/components/layouts/header/Header";
import Container from "@/components/ui/container/Container";
import FormSection from "@/components/ui/form/FormSection";
import Load from "@/components/ui/load/Load";
import { useCreateReservers } from "@/modules/reservers/hooks/useCreateReservers";
import { parseErrors } from "@/utils/parseErrors";
import { Form, Select, SelectItem } from "@heroui/react";
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
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <Controller
                control={control}
                name="busId"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Bus"
                    placeholder="Seleccione un bus"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="max-w-full"
                    isInvalid={!!errors.busId}
                    errorMessage={errors.busId?.message}
                    items={resBus?.body ?? []}
                  >
                    {(item) => (
                      <SelectItem key={item.busId} textValue={item.plate}>
                        PLACA - {item.plate}
                      </SelectItem>
                    )}
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="driverId"
                render={({ field }) => (
                  <Select
                    {...field}
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
                render={({ field }) => (
                  <Select
                    {...field}
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
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Check Out"
                    placeholder="Seleccione un check out"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="max-w-full"
                    isInvalid={!!errors.checkInId}
                    errorMessage={errors.checkInId?.message}
                    items={resDestination?.body ?? []}
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

              {/* <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Fecha"
                    placeholder="Fecha"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="max-w-full"
                    isInvalid={!!errors.date}
                    errorMessage={errors.date?.message}
                  />
                )}
              /> */}
            </div>
          </FormSection>
        </div>
      </Container>
    </Form>
  );
}
