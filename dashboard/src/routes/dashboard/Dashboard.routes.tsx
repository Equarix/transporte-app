import { Route, Routes } from "react-router";
import DestinationsRoute from "../destinations/destinations.routes";
import GaleryPage from "@/pages/galery/GaleryPage";
import AgencyRoutes from "../agency/agency.routes";
import BusRoutes from "../bus/bus.routes";
import UserRoutes from "../user/user.routes";
import SalesReportPage from "@/modules/reports/pages/SalesReportPage";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Inicio dashboard</h1>} />
      <Route path="/destinations/*" element={<DestinationsRoute />} />
      <Route path="/galery" element={<GaleryPage />} />
      <Route path="/bus/*" element={<BusRoutes />} />
      <Route path="/agency/*" element={<AgencyRoutes />} />
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/reports/sales" element={<SalesReportPage />} />
    </Routes>
  );
}
