import Header from "@/components/layouts/header/Header";
import Container from "@/components/ui/container/Container";
import FormSection from "@/components/ui/form/FormSection";
import InputDate from "@/components/ui/input-date/InputDate";
import Load from "@/components/ui/load/Load";
import { useCreateReservers } from "@/modules/reservers/hooks/useCreateReservers";
import { parseErrors } from "@/utils/parseErrors";
import {
  cn,
  Form,
  Select,
  SelectItem,
  Input,
  Card,
  CardBody,
  Image,
} from "@heroui/react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { LuInfo, LuPlus, LuDollarSign, LuStore } from "react-icons/lu";
import { useEffect } from "react";
import { ENV } from "@/config/env";

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
    agencies: { resAgencies },
    isLoading,
  } = useCreateReservers();

  const busId = useWatch({
    control,
    name: "busId",
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "reserverPriceFloors",
  });

  const {
    fields: agencyFields,
    append: appendAgency,
    remove: removeAgency,
  } = useFieldArray({
    control,
    name: "reserverAgencies",
  });

  const selectedBus = resBus?.body.find((b) => b.busId === busId);

  useEffect(() => {
    if (selectedBus) {
      replace(
        selectedBus.floors.map((floor) => ({
          floorId: floor.floorId,
          price: 0,
        })),
      );
    } else {
      replace([]);
    }
  }, [selectedBus]);

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
                  <div>
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
                  </div>
                )}
              />

              <Controller
                control={control}
                name="driverId"
                render={({ field: { value, onChange } }) => (
                  <div>
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
                  </div>
                )}
              />

              <Controller
                control={control}
                name="checkInId"
                render={({ field: { value, onChange } }) => (
                  <div>
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
                  </div>
                )}
              />
              <Controller
                control={control}
                name="checkOutId"
                render={({ field: { value, onChange } }) => (
                  <div>
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
                  </div>
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

          {selectedBus && (
            <FormSection
              title="Precios por Piso"
              description="Establezca los precios para cada nivel del bus seleccionado"
              icon={<LuDollarSign className="size-5" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fields.map((field, index) => {
                  const floorName =
                    selectedBus.floors.find((f) => f.floorId === field.floorId)
                      ?.name || `Piso ${index + 1}`;

                  return (
                    <Controller
                      key={field.id}
                      control={control}
                      name={`reserverPriceFloors.${index}.price`}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          type="number"
                          label={`Precio - ${floorName}`}
                          placeholder="0.00"
                          labelPlacement="outside"
                          variant="bordered"
                          radius="lg"
                          size="lg"
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                S/
                              </span>
                            </div>
                          }
                          value={value === 0 ? "" : String(value)}
                          onValueChange={(val) => onChange(Number(val))}
                          isInvalid={!!errors.reserverPriceFloors?.[index]}
                          errorMessage={
                            errors.reserverPriceFloors?.[index]?.price?.message
                          }
                        />
                      )}
                    />
                  );
                })}
              </div>
            </FormSection>
          )}

          <FormSection
            title="Agencias participantes"
            description="Seleccione las agencias que participan en esta reserva y asigne una hora"
            icon={<LuStore className="size-5" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resAgencies?.body.map((agency) => {
                const agencyIndex = agencyFields.findIndex(
                  (f) => f.agencyId === agency.agencyId,
                );
                const isSelected = agencyIndex !== -1;

                return (
                  <Card
                    isPressable
                    key={agency.agencyId}
                    onPress={() => {
                      if (isSelected) {
                        removeAgency(agencyIndex);
                      } else {
                        appendAgency({ agencyId: agency.agencyId, hour: "" });
                      }
                    }}
                    className={cn(
                      "border-2 transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary-50/50"
                        : "border-transparent bg-white hover:border-default-200 shadow-sm",
                    )}
                  >
                    <CardBody className="p-4 flex flex-col gap-4">
                      <div className="flex flex-row items-center gap-4">
                        <div className="size-16 rounded-xl overflow-hidden bg-default-100 shrink-0 flex items-center justify-center">
                          {agency.galery?.imageUrl ? (
                            <Image
                              src={ENV.API_URL + agency.galery.imageUrl}
                              alt={agency.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <LuStore className="text-default-400 size-8" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-small truncate">
                            {agency.name}
                          </span>
                          <span className="text-tiny text-default-400 line-clamp-2">
                            {agency.address}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          className="pt-2 border-t border-primary/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Controller
                            control={control}
                            name={`reserverAgencies.${agencyIndex}.hour`}
                            render={({ field: { value, onChange } }) => (
                              <Input
                                type="time"
                                label="Hora de Salida"
                                labelPlacement="outside"
                                placeholder="--:--"
                                variant="bordered"
                                radius="md"
                                size="sm"
                                value={value}
                                onChange={onChange}
                                isInvalid={
                                  !!errors.reserverAgencies?.[agencyIndex]?.hour
                                }
                                errorMessage={
                                  errors.reserverAgencies?.[agencyIndex]?.hour
                                    ?.message
                                }
                              />
                            )}
                          />
                        </div>
                      )}
                    </CardBody>
                  </Card>
                );
              })}
            </div>
            {errors.reserverAgencies && (
              <p className="text-tiny text-danger mt-2">
                {errors.reserverAgencies.message}
              </p>
            )}
          </FormSection>
        </div>
      </Container>
    </Form>
  );
}
