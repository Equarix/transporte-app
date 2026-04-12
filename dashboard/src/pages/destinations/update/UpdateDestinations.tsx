import { useParams } from "react-router";
import { useGetDestination } from "@/modules/destinations/hooks/useDestinations";
import DestinationForm from "@/modules/destinations/components/DestinationForm";
import Load from "@/components/ui/load/Load";

export default function UpdateDestinations() {
  const { id } = useParams();
  const { data, isLoading } = useGetDestination(id);

  if (isLoading) return <Load loading={true} />;
  if (!data?.body) return <div>No se encontró el destino</div>;

  return <DestinationForm initialData={data.body} isUpdate={true} />;
}
