import { useAuth } from "@/components/providers/AuthContext";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/interface/response.interface";

export interface AgencyPerformanceMetric {
  agencyId: number;
  name: string;
  address: string;
  ticketsSold: number;
  conversionRate: number;
  revenue: number;
  target: number;
  targetMeta: string;
  lat: number;
  lng: number;
}

export interface CityChartMetric {
  name: string;
  actual: number;
  target: number;
}

export interface AgencyReportResponse {
  agencies: AgencyPerformanceMetric[];
  chartData: CityChartMetric[];
}

export function useAgencyReport() {
  const { token } = useAuth();

  return useQuery<ApiResponse<AgencyReportResponse>, Error, AgencyReportResponse>({
    queryKey: ["agency-report"],
    queryFn: async () => {
      const response = await instance.get<ApiResponse<AgencyReportResponse>>("/reports/agencies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    select: (data) => data.body,
  });
}
