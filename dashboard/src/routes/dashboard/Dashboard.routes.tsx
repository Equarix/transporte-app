import { Route, Routes } from "react-router";
import DestinationsRoute from "../destinations/destinations.routes";
import GaleryPage from "@/pages/galery/GaleryPage";
import AgencyRoutes from "../agency/agency.routes";
import BusRoutes from "../bus/bus.routes";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Inicio dashboard</h1>} />
      <Route path="/destinations/*" element={<DestinationsRoute />} />
      <Route path="/galery" element={<GaleryPage />} />
      <Route path="/bus/*" element={<BusRoutes />} />
      <Route path="/agency/*" element={<AgencyRoutes />} />
    </Routes>
  );
}
