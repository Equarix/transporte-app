import { Route, Routes } from "react-router";
import Bus from "../../pages/bus/Bus";
import CreateBus from "@/pages/bus/create/CreateBus";

export default function BusRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Bus />} />
      <Route path="/create" element={<CreateBus />} />
    </Routes>
  );
}
