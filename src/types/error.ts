export interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  instance: string;
  error_code: string;
  violations?: { field: string; message: string }[];
}
