import type { FieldErrors, FieldValues } from "react-hook-form";

export function parseErrors<T extends FieldValues>(errors: FieldErrors<T>) {
  const validationErrors = Object.entries(errors).reduce(
    (acc, [key, error]) => {
      if (error?.message) {
        acc[key] = error.message as string;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
  return validationErrors;
}
