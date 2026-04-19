import UserForm from "@/modules/user/components/UserForm";
import { useParams } from "react-router";
import { useGetUserById } from "@/modules/user/hooks/useUser";
import Load from "@/components/ui/load/Load";

export default function UpdateUser() {
  const { id } = useParams();
  const { data, isLoading } = useGetUserById(id);

  if (isLoading) return <Load loading={true} />;
  if (!data?.body)
    return <div className="p-10 text-center text-foreground">No se encontró el usuario</div>;

  return <UserForm initialData={data.body} isUpdate={true} />;
}
