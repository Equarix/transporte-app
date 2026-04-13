import { useNavigate } from "react-router";
import { LuPlus } from "react-icons/lu";
import Container from "@/components/ui/container/Container";
import Header from "@/components/layouts/header/Header";

export default function Bus() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header
        text={{
          header: "Buses",
          button: "Crear Bus",
        }}
        icon={<LuPlus />}
        onClick={() => navigate("/bus/create")}
      />
    </Container>
  );
}
