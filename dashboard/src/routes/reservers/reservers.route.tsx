import { Route, Routes } from "react-router";
import CreateReservers from "@/pages/reservers/create/CreateReservers";

export default function ReserversRoute() {
  return (
    <Routes>
      <Route path="/" element={<>a</>} />
      <Route path="/create" element={<CreateReservers />} />
    </Routes>
  );
}
