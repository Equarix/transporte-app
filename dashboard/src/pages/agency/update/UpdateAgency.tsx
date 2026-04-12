import AgencyForm from "@/modules/agency/components/AgencyForm";
import { useParams } from "react-router";
import { useGetAgency } from "@/modules/agency/hooks/useAgency";
import Load from "@/components/ui/load/Load";

export default function UpdateAgency() {
  const { id } = useParams();
  const { data, isLoading } = useGetAgency(id);

  if (isLoading) return <Load loading={true} />;
  if (!data?.body) return <div className="p-10 text-center">No se encontró la agencia</div>;

  return <AgencyForm initialData={data.body} isUpdate={true} />;
}
