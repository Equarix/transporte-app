import { useAuth } from "@/components/providers/AuthContext";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/interface/response.interface";

export interface AgentSalesMetric {
  userId: number;
  name: string;
  email: string;
  terminalName: string;
  tickets: number;
  convRate: number;
  totalSales: number;
  commission: number;
  status: string;
}

export interface SalesAgentReportResponse {
  totalSalesRevenue: number;
  ticketsSold: number;
  avgCommission: number;
  conversionRate: number;
  agents: AgentSalesMetric[];
}

export function useSalesAgentReport() {
  const { token } = useAuth();

  return useQuery<ApiResponse<SalesAgentReportResponse>, Error, SalesAgentReportResponse>({
    queryKey: ["sales-agent-report"],
    queryFn: async () => {
      const response = await instance.get<ApiResponse<SalesAgentReportResponse>>("/reports/sales-agents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    select: (data) => data.body,
  });
}
