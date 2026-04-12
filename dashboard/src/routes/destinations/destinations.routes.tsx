import MapProvider from "@/components/providers/MapProvider";
import { ENV } from "@/config/env";
import CreateDestinations from "@/pages/destinations/create/CreateDestinations";
import Destinations from "@/pages/destinations/Destinations";
import UpdateDestinations from "@/pages/destinations/update/UpdateDestinations";
import { Route, Routes } from "react-router";

export default function DestinationsRoute() {
  return (
    <Routes>
      <Route path="/" element={<Destinations />} />
      <Route
        path="/create"
        element={
          <MapProvider apiKey={ENV.GOOGLE_MAPS}>
            <CreateDestinations />
          </MapProvider>
        }
      />
      <Route
        path="/update/:id"
        element={
          <MapProvider apiKey={ENV.GOOGLE_MAPS}>
            <UpdateDestinations />
          </MapProvider>
        }
      />
    </Routes>
  );
}
