import { PropsWithChildren } from "react";

export interface ApiResponse<T> {
  body: T;
  message: string;
  status: number;
  token?: string;
}

export interface GenericProps extends PropsWithChildren {
  className?: string;
}
