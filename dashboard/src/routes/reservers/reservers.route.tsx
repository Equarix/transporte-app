import { Route, Routes } from "react-router";
import CreateReservers from "@/pages/reservers/create/CreateReservers";
import Reservers from "@/pages/reservers/Reservers";

export default function ReserversRoute() {
  return (
    <Routes>
      <Route path="/" element={<Reservers />} />
      <Route path="/create" element={<CreateReservers />} />
    </Routes>
  );
}
