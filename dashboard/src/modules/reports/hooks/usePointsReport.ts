import { useAuth } from "@/components/providers/AuthContext";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/interface/response.interface";

export interface TopMember {
  userId: number;
  customer: string;
  email: string;
  pointBalance: number;
  status: string;
  velocity: string;
}

export interface PointsReportResponse {
  totalIssued: number;
  totalRedeemed: number;
  activeMembers: number;
  accumulationRate: number;
  redemptionRate: number;
  topMembers: TopMember[];
}

export function usePointsReport() {
  const { token } = useAuth();

  return useQuery<ApiResponse<PointsReportResponse>, Error, PointsReportResponse>({
    queryKey: ["points-report"],
    queryFn: async () => {
      const response = await instance.get<ApiResponse<PointsReportResponse>>("/reports/points", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    select: (data) => data.body,
  });
}
