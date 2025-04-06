export interface ResponseStructureInterface {
  data?: object;
  items?: object[] | object;
  message?: string[] | string;
  error?: object;
  statusCode?: number;
  isSuccess: boolean;
  count?: number;
  offset?: number;
  limit?: number;
  page?: number;
  meta?: object;
  pageSize?: number;
}
