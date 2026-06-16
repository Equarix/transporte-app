import { useAuth } from "@/components/providers/AuthContext";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/interface/response.interface";

export interface SaleDetailReport {
  saleDetailId: number;
  busId: number;
  seatId: number;
  documentType: string;
  documentNumber: string;
  name: string;
  amount: number;
  row: number;
  column: number;
  floor: number;
  typeSeat: string;
}

export interface RecentTransaction {
  saleId: number;
  bookingId: string;
  route: string;
  busClass: string;
  customer: string;
  status: string;
  date: string;
  amount: number;
}

export interface SalesTrend {
  month: string;
  direct: number;
  agencies: number;
}

export interface SalesReportResponse {
  totalRevenue: number;
  ticketsSold: number;
  growthRate: number;
  occupancyRate: number;
  trends: SalesTrend[];
  recentSales: RecentTransaction[];
}

export function useSalesReport() {
  const { token } = useAuth();

  return useQuery<ApiResponse<SalesReportResponse>, Error, SalesReportResponse>({
    queryKey: ["sales-report"],
    queryFn: async () => {
      const response = await instance.get<ApiResponse<SalesReportResponse>>("/reports/sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    select: (data) => data.body,
  });
}

