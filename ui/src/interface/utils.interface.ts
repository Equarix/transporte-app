import { PropsWithChildren } from "react";

export interface ApiResponse<T> {
  body: T;
  message: string;
  status: number;
}

export interface GenericProps extends PropsWithChildren {
  className?: string;
}
