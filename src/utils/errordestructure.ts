import { FieldError } from "../generated/graphql";

export const ErrorDestructure = (error: FieldError[]) => {
  const errors: Record<string, string> = {};
  error.forEach((err) => {
    errors[err.field] = err.message;
  });
  return errors;
};
