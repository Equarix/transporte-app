import { Controller } from "react-hook-form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Spinner,
} from "@heroui/react";
import {
  DiscountMode,
  PromoApplicableTo,
  PromoType,
  type Promo,
} from "../types/promo.types";
import { useCreatePromo, useUpdatePromo } from "../hooks/usePromoForm";

interface PromoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  promo?: Promo;
}

// ─── Create wrapper ────────────────────────────────────────────────────────────
function CreateForm({ onClose }: { onClose: () => void }) {
  const { form, handleSubmit, isPending } = useCreatePromo({
    onSuccess: onClose,
  });
  return (
    <PromoFormInner
      form={form}
      handleSubmit={handleSubmit}
      isPending={isPending}
      onClose={onClose}
    />
  );
}

// ─── Edit wrapper ──────────────────────────────────────────────────────────────
function EditForm({ promo, onClose }: { promo: Promo; onClose: () => void }) {
  const { form, handleSubmit, isPending } = useUpdatePromo({
    promo,
    onSuccess: onClose,
  });
  return (
    <PromoFormInner
      form={form}
      handleSubmit={handleSubmit}
      isPending={isPending}
      onClose={onClose}
    />
  );
}

// ─── Shared inner form ─────────────────────────────────────────────────────────
function PromoFormInner({
  form,
  handleSubmit,
  isPending,
  onClose,
}: {
  form:
    | ReturnType<typeof useCreatePromo>["form"]
    | ReturnType<typeof useUpdatePromo>["form"];
  handleSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  onClose: () => void;
}) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const promoType = watch("promoType");
  const discountMode = watch("discountMode");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Row: code + name */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          {...register("code")}
          id="promo-code"
          label="Código"
          labelPlacement="outside"
          placeholder="VERANO25"
          variant="bordered"
          isInvalid={!!errors.code}
          errorMessage={errors.code?.message}
        />
        <Input
          {...register("name")}
          id="promo-name"
          label="Nombre"
          labelPlacement="outside"
          placeholder="Descuento de verano"
          variant="bordered"
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
        />
      </div>

      {/* Description */}
      <Textarea
        {...register("description")}
        id="promo-description"
        label="Descripción (opcional)"
        labelPlacement="outside"
        placeholder="Breve descripción visible al usuario..."
        variant="bordered"
        minRows={2}
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
      />

      {/* Row: tipo + aplica a */}
      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="promoType"
          control={control}
          render={({ field }) => (
            <Select
              id="promo-type"
              label="Tipo de promo"
              labelPlacement="outside"
              placeholder="Seleccionar"
              variant="bordered"
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as PromoType;
                field.onChange(val);
              }}
              isInvalid={!!errors.promoType}
              errorMessage={errors.promoType?.message}
            >
              <SelectItem key={PromoType.DESCUENTO}>Descuento</SelectItem>
              <SelectItem key={PromoType.REGALO}>Regalo</SelectItem>
            </Select>
          )}
        />
        <Controller
          name="applicableTo"
          control={control}
          render={({ field }) => (
            <Select
              id="promo-applicable-to"
              label="Aplica a"
              labelPlacement="outside"
              placeholder="Seleccionar"
              variant="bordered"
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as PromoApplicableTo;
                field.onChange(val);
              }}
              isInvalid={!!errors.applicableTo}
              errorMessage={errors.applicableTo?.message}
            >
              <SelectItem key={PromoApplicableTo.TICKET}>Ticket</SelectItem>
              <SelectItem key={PromoApplicableTo.HOTEL}>Hotel</SelectItem>
              <SelectItem key={PromoApplicableTo.AMBOS}>Ambos</SelectItem>
            </Select>
          )}
        />
      </div>

      {/* Descuento fields */}
      {promoType === PromoType.DESCUENTO && (
        <div className="grid grid-cols-3 gap-3">
          <Controller
            name="discountMode"
            control={control}
            render={({ field }) => (
              <Select
                id="promo-discount-mode"
                label="Modo"
                labelPlacement="outside"
                placeholder="Tipo"
                variant="bordered"
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as DiscountMode;
                  field.onChange(val);
                }}
                isInvalid={!!errors.discountMode}
                errorMessage={errors.discountMode?.message}
              >
                <SelectItem key={DiscountMode.PORCENTAJE}>%</SelectItem>
                <SelectItem key={DiscountMode.MONTO_FIJO}>Monto fijo</SelectItem>
              </Select>
            )}
          />
          <Input
            {...register("discountValue")}
            id="promo-discount-value"
            label="Valor"
            labelPlacement="outside"
            type="number"
            step="0.01"
            placeholder={
              discountMode === DiscountMode.PORCENTAJE ? "15" : "10.00"
            }
            variant="bordered"
            isInvalid={!!errors.discountValue}
            errorMessage={errors.discountValue?.message}
          />
          {discountMode === DiscountMode.PORCENTAJE && (
            <Input
              {...register("maxDiscountCap")}
              id="promo-max-cap"
              label="Tope máx."
              labelPlacement="outside"
              type="number"
              step="0.01"
              placeholder="50.00"
              variant="bordered"
              isInvalid={!!errors.maxDiscountCap}
              errorMessage={errors.maxDiscountCap?.message}
            />
          )}
        </div>
      )}

      {/* Regalo field */}
      {promoType === PromoType.REGALO && (
        <Input
          {...register("giftDescription")}
          id="promo-gift-description"
          label="Descripción del regalo"
          labelPlacement="outside"
          placeholder="Mochila de viaje con logo Entrafesa"
          variant="bordered"
          isInvalid={!!errors.giftDescription}
          errorMessage={errors.giftDescription?.message}
        />
      )}

      {/* Vigencia: fecha inicio */}
      <div className="space-y-1">
        <span className="text-sm font-medium text-foreground">Inicia el</span>
        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="startsAt"
            control={control}
            render={({ field }) => (
              <Input
                id="promo-starts-date"
                label="Fecha"
                labelPlacement="outside"
                type="date"
                variant="bordered"
                value={field.value ? field.value.slice(0, 10) : ""}
                onChange={(e) => {
                  const time = field.value?.slice(11, 16) ?? "00:00";
                  field.onChange(`${e.target.value}T${time}`);
                }}
                isInvalid={!!errors.startsAt}
                errorMessage={errors.startsAt?.message}
              />
            )}
          />
          <Controller
            name="startsAt"
            control={control}
            render={({ field }) => (
              <Input
                id="promo-starts-time"
                label="Hora"
                labelPlacement="outside"
                type="time"
                variant="bordered"
                value={field.value ? (field.value.slice(11, 16) || "") : ""}
                onChange={(e) => {
                  const date = field.value?.slice(0, 10) ?? "";
                  if (date) field.onChange(`${date}T${e.target.value}`);
                }}
              />
            )}
          />
        </div>
      </div>

      {/* Vigencia: fecha fin */}
      <div className="space-y-1">
        <span className="text-sm font-medium text-foreground">Expira el</span>
        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="expiresAt"
            control={control}
            render={({ field }) => (
              <Input
                id="promo-expires-date"
                label="Fecha"
                labelPlacement="outside"
                type="date"
                variant="bordered"
                value={field.value ? field.value.slice(0, 10) : ""}
                onChange={(e) => {
                  const time = field.value?.slice(11, 16) ?? "00:00";
                  field.onChange(`${e.target.value}T${time}`);
                }}
                isInvalid={!!errors.expiresAt}
                errorMessage={errors.expiresAt?.message}
              />
            )}
          />
          <Controller
            name="expiresAt"
            control={control}
            render={({ field }) => (
              <Input
                id="promo-expires-time"
                label="Hora"
                labelPlacement="outside"
                type="time"
                variant="bordered"
                value={field.value ? (field.value.slice(11, 16) || "") : ""}
                onChange={(e) => {
                  const date = field.value?.slice(0, 10) ?? "";
                  if (date) field.onChange(`${date}T${e.target.value}`);
                }}
              />
            )}
          />
        </div>
      </div>

      {/* Limits */}
      <div className="grid grid-cols-3 gap-3">
        <Input
          {...register("minimumPurchaseAmount")}
          id="promo-min-amount"
          label="Monto mínimo"
          labelPlacement="outside"
          type="number"
          step="0.01"
          placeholder="0"
          variant="bordered"
          isInvalid={!!errors.minimumPurchaseAmount}
          errorMessage={errors.minimumPurchaseAmount?.message}
        />
        <Input
          {...register("maxGlobalUses")}
          id="promo-max-global-uses"
          label="Usos globales"
          labelPlacement="outside"
          type="number"
          placeholder="∞"
          variant="bordered"
          isInvalid={!!errors.maxGlobalUses}
          errorMessage={errors.maxGlobalUses?.message}
        />
        <Input
          {...register("maxUsesPerUser")}
          id="promo-max-uses-per-user"
          label="Usos por usuario"
          labelPlacement="outside"
          type="number"
          placeholder="∞"
          variant="bordered"
          isInvalid={!!errors.maxUsesPerUser}
          errorMessage={errors.maxUsesPerUser?.message}
        />
      </div>

      {/* Footer */}
      <ModalFooter className="px-0 pb-0">
        <Button variant="light" onPress={onClose} id="promo-form-cancel">
          Cancelar
        </Button>
        <Button
          type="submit"
          color="primary"
          id="promo-form-submit"
          isLoading={isPending}
          isDisabled={isPending}
          startContent={isPending ? <Spinner size="sm" /> : undefined}
        >
          {isPending ? "Guardando…" : "Guardar promo"}
        </Button>
      </ModalFooter>
    </form>
  );
}

// ─── Modal shell ───────────────────────────────────────────────────────────────
export function PromoFormModal({ isOpen, onClose, promo }: PromoFormModalProps) {
  const isEditing = !!promo;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) onClose(); }}
      size="2xl"
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-default-100">
              <span className="text-lg font-bold">
                {isEditing ? "Editar promo" : "Nueva promo"}
              </span>
              <span className="text-small text-default-400 font-normal">
                {isEditing
                  ? `Editando: ${promo.code}`
                  : "Completa los campos para crear una nueva promoción"}
              </span>
            </ModalHeader>

            <ModalBody className="py-6">
              {isEditing ? (
                <EditForm promo={promo} onClose={onClose} />
              ) : (
                <CreateForm onClose={onClose} />
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
