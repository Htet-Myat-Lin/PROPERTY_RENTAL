import axios from "axios";

interface ApiErrorBody {
  message?: string;
  errors?: { field: string; message: string }[];
}

const readBody = (error: unknown): ApiErrorBody | undefined => {
  if (!axios.isAxiosError(error)) return undefined;
  return error.response?.data as ApiErrorBody | undefined;
};

export const getApiErrorMessage = (error: unknown, fallback = "Something went wrong"): string => {
  const body = readBody(error);
  return body?.message || body?.errors?.[0]?.message || fallback;
};

export const getApiFieldErrors = (error: unknown): Record<string, string> => {
  const body = readBody(error);
  return (body?.errors ?? []).reduce<Record<string, string>>((acc, issue) => {
    if (issue.field && !acc[issue.field]) acc[issue.field] = issue.message;
    return acc;
  }, {});
};
