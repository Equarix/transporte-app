import { useUserForm } from "@/modules/user/hooks/useUserForm";
import { Form, Input, Select, SelectItem } from "@heroui/react";
import { Controller } from "react-hook-form";
import { LuPlus, LuUser, LuKey, LuFileText, LuSave } from "react-icons/lu";
import Header from "@/components/layouts/header/Header";
import Container from "@/components/ui/container/Container";
import FormSection from "@/components/ui/form/FormSection";
import Load from "@/components/ui/load/Load";
import { parseErrors } from "@/utils/parseErrors";
import { RoleEnum, TypeDocument, TypeUser } from "@/schemas/user/user.schema";
import InputDate from "@/components/ui/input-date/InputDate";
import type { AuthResponse } from "@/interface/response.interface";

const ROLE_LABELS: Record<RoleEnum, string> = {
  [RoleEnum.ADMIN]: "Administrador",
  [RoleEnum.SELLER]: "Vendedor",
};

const TYPE_USER_LABELS: Record<TypeUser, string> = {
  [TypeUser.EMPLOYEE]: "Empleado",
  [TypeUser.DRIVER]: "Conductor",
};

const TYPE_DOCUMENT_LABELS: Record<TypeDocument, string> = {
  [TypeDocument.DNI]: "DNI",
  [TypeDocument.PASSPORT]: "Pasaporte",
};

interface UserFormProps {
  initialData?: AuthResponse;
  isUpdate?: boolean;
}

export default function UserForm({
  initialData,
  isUpdate = false,
}: UserFormProps) {
  const {
    form: {
      control,
      formState: { errors },
    },
    onSubmit,
    isPending,
  } = useUserForm({ initialData, isUpdate });

  return (
    <Form
      onSubmit={onSubmit}
      className="w-full pb-20"
      validationErrors={parseErrors(errors)}
    >
      <Load loading={isPending} />
      <Container className="mx-auto space-y-4">
        <Header
          text={{
            header: isUpdate ? "Actualizar Usuario" : "Crear Usuario",
            button: isUpdate ? "Actualizar" : "Crear",
          }}
          icon={isUpdate ? <LuSave size={20} /> : <LuPlus className="size-5" />}
          type="submit"
          className={{
            button: "px-8 h-12 shadow-md hover:shadow-lg transition-all",
          }}
        />

        <div className="flex flex-col gap-6">
          <FormSection
            title="Información Personal"
            description="Detalles básicos del usuario"
            icon={<LuUser className="size-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nombre"
                    placeholder="Ingrese el nombre"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    isInvalid={!!errors.firstName}
                    errorMessage={errors.firstName?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Apellido"
                    placeholder="Ingrese el apellido"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    isInvalid={!!errors.lastName}
                    errorMessage={errors.lastName?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <InputDate
                    label="Fecha de Nacimiento"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Teléfono"
                    placeholder="Ingrese el teléfono"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone?.message}
                  />
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Documentación"
            description="Identificación oficial"
            icon={<LuFileText className="size-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <Controller
                control={control}
                name="typeDocument"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Tipo de Documento"
                    placeholder="Seleccione el tipo"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }
                    isInvalid={!!errors.typeDocument}
                    errorMessage={errors.typeDocument?.message}
                  >
                    {Object.values(TypeDocument).map((type) => (
                      <SelectItem key={type}>
                        {TYPE_DOCUMENT_LABELS[type]}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="documentNumber"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Número de Documento"
                    placeholder="Ingrese el número"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    isInvalid={!!errors.documentNumber}
                    errorMessage={errors.documentNumber?.message}
                  />
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Configuración de Cuenta"
            description="Credenciales y roles"
            icon={<LuKey className="size-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    label="Correo Electrónico"
                    placeholder="ejemplo@email.com"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    label="Contraseña"
                    placeholder={
                      isUpdate
                        ? "Deje en blanco para mantener actual"
                        : "Mínimo 6 caracteres"
                    }
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Rol"
                    placeholder="Seleccione el rol"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }
                    isInvalid={!!errors.role}
                    errorMessage={errors.role?.message}
                  >
                    {Object.values(RoleEnum).map((role) => (
                      <SelectItem key={role}>{ROLE_LABELS[role]}</SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="typeUser"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Tipo de Usuario"
                    placeholder="Seleccione el tipo"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }
                    isInvalid={!!errors.typeUser}
                    errorMessage={errors.typeUser?.message}
                  >
                    {Object.values(TypeUser).map((type) => (
                      <SelectItem key={type}>
                        {TYPE_USER_LABELS[type]}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>
          </FormSection>
        </div>
      </Container>
    </Form>
  );
}
