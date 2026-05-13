import { Route, Routes } from "react-router";
import Bus from "../../pages/bus/Bus";
import CreateBus from "@/pages/bus/create/CreateBus";
import ReserversRoute from "../reservers/reservers.route";
import UpdateBus from "@/pages/bus/update/UpdateBus";

export default function BusRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Bus />} />
      <Route path="/create" element={<CreateBus />} />
      <Route path="/reservers/*" element={<ReserversRoute />} />
      <Route path="/update/:id" element={<UpdateBus />} />
    </Routes>
  );
}
