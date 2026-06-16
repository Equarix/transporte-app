import { useAuth } from "@/components/providers/AuthContext";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/interface/response.interface";

export interface RoutePerformanceMetric {
  routeId: string;
  originName: string;
  destName: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  passengerVolume: number;
  grossProfit: number;
  loadFactor: number;
  trend: string;
}

export interface RoutesReportResponse {
  totalRouteRevenue: number;
  avgPassengerLoad: number;
  routes: RoutePerformanceMetric[];
}

export function useRoutesReport() {
  const { token } = useAuth();

  return useQuery<ApiResponse<RoutesReportResponse>, Error, RoutesReportResponse>({
    queryKey: ["routes-report"],
    queryFn: async () => {
      const response = await instance.get<ApiResponse<RoutesReportResponse>>("/reports/routes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    select: (data) => data.body,
  });
}
