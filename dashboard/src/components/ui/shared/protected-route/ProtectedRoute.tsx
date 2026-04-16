import { useAuth } from "@/components/providers/AuthContext";
import { instance } from "@/libs/axios";
import { useEffect, type PropsWithChildren } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, token } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const revalidate = async () => {
      try {
        const res = await instance.get("/auth/revalidate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status !== 200) {
          navigate("/auth/login");
        }
      } catch {
        navigate("/auth/login");
      }
    };

    revalidate();
  }, []);

  if (!user) return <Navigate to="/auth/login" />;

  return children ? children : <Outlet />;
}
