import { instance } from '@/libs/axios';
import type { ApiResponse } from '@/interface/response.interface';
import type { Promo, CreatePromoPayload, UpdatePromoPayload } from '../types/promo.types';

const PROMOS_BASE = '/promos';

export const promosService = {
  async getAll(token: string): Promise<Promo[]> {
    const res = await instance.get<ApiResponse<Promo[]>>(PROMOS_BASE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.body;
  },

  async getOne(id: number, token: string): Promise<Promo> {
    const res = await instance.get<ApiResponse<Promo>>(`${PROMOS_BASE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.body;
  },

  async create(payload: CreatePromoPayload, token: string): Promise<Promo> {
    const res = await instance.post<ApiResponse<Promo>>(PROMOS_BASE, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.body;
  },

  async update(
    id: number,
    payload: Omit<UpdatePromoPayload, 'id'>,
    token: string,
  ): Promise<Promo> {
    const res = await instance.put<ApiResponse<Promo>>(
      `${PROMOS_BASE}/${id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return res.data.body;
  },

  async remove(id: number, token: string): Promise<void> {
    await instance.delete(`${PROMOS_BASE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
