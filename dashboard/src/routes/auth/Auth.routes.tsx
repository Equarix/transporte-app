import LoginPage from "@/pages/auth/Login";
import { Route, Routes } from "react-router";

export default function zAuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
