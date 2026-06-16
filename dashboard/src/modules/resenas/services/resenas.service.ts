import { instance } from '@/libs/axios';
import type { ApiResponse } from '@/interface/response.interface';

export interface Review {
  resenaId: number;
  saleId: number;
  userId: number;
  comfortScore: number;
  punctualityScore: number;
  serviceScore: number;
  driverScore: number;
  comment: string | null;
  createdAt: string;
}

export interface ReviewMetrics {
  totalReviews: number;
  avgComfort: number;
  avgPunctuality: number;
  avgService: number;
  avgDriver: number;
  avgOverall: number;
  ratingDistribution: Record<number, number>;
}

const RESENAS_BASE = '/resenas';

export const resenasService = {
  async getAll(token: string): Promise<Review[]> {
    const res = await instance.get<ApiResponse<Review[]>>(RESENAS_BASE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.body;
  },

  async getMetrics(token: string): Promise<ReviewMetrics> {
    const res = await instance.get<ApiResponse<ReviewMetrics>>(`${RESENAS_BASE}/metrics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.body;
  },

  async remove(id: number, token: string): Promise<void> {
    await instance.delete(`${RESENAS_BASE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
