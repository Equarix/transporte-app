import { Route, Routes } from "react-router";
import DestinationsRoute from "../destinations/destinations.routes";
import GaleryPage from "@/pages/galery/GaleryPage";
import AgencyRoutes from "../agency/agency.routes";
import BusRoutes from "../bus/bus.routes";
import UserRoutes from "../user/user.routes";
import SalesReportPage from "@/modules/reports/pages/SalesReportPage";
import PointsReportPage from "@/modules/reports/pages/PointsReportPage";
import SalesAgentReportPage from "@/modules/reports/pages/SalesAgentReportPage";
import AgencyReportPage from "@/modules/reports/pages/AgencyReportPage";
import RoutesReportPage from "@/modules/reports/pages/RoutesReportPage";
import MapProvider from "@/components/providers/MapProvider";
import { ENV } from "@/config/env";
import PromosPage from "@/modules/promos/pages/PromosPage";

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
      <Route path="/reports/points" element={<PointsReportPage />} />
      <Route path="/reports/sales-agents" element={<SalesAgentReportPage />} />
      <Route
        path="/reports/agencies"
        element={
          <MapProvider apiKey={ENV.GOOGLE_MAPS}>
            <AgencyReportPage />
          </MapProvider>
        }
      />
      <Route
        path="/reports/routes"
        element={
          <MapProvider apiKey={ENV.GOOGLE_MAPS}>
            <RoutesReportPage />
          </MapProvider>
        }
      />
      <Route path="/promos" element={<PromosPage />} />
    </Routes>
  );
}
