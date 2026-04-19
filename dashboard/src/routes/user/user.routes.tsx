import CreateUser from "@/pages/user/create/CreateUser";
import UpdateUser from "@/pages/user/update/UpdateUser";
import User from "@/pages/user/User";
import { Route, Routes } from "react-router";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<User />} />
      <Route path="/create" element={<CreateUser />} />
      <Route path="/update/:id" element={<UpdateUser />} />
    </Routes>
  );
}
