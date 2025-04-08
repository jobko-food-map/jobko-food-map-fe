import type { ReportInfo } from './schemas';

export interface GetReportsResponse {
  content: ReportInfo[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
}

export type V1AllReportGetResponse = GetReportsResponse;
