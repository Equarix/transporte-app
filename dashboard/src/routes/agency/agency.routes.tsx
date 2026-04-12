import MapProvider from "@/components/providers/MapProvider";
import { ENV } from "@/config/env";
import Agency from "@/pages/agency/Agency";
import CreateAgency from "@/pages/agency/create/CreateAgency";
import UpdateAgency from "@/pages/agency/update/UpdateAgency";
import { Route, Routes } from "react-router";

export default function AgencyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Agency />} />
      <Route
        path="/create"
        element={
          <MapProvider apiKey={ENV.GOOGLE_MAPS}>
            <CreateAgency />
          </MapProvider>
        }
      />
      <Route
        path="/update/:id"
        element={
          <MapProvider apiKey={ENV.GOOGLE_MAPS}>
            <UpdateAgency />
          </MapProvider>
        }
      />
    </Routes>
  );
}
