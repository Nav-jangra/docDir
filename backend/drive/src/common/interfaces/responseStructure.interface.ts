export interface ResponseStructureInterface {
  data?: object;
  items?: object[] | object;
  message?: string[] | string;
  error?: string;
  statusCode?: number;
  isSuccess: boolean;
  count?: number;
  offset?: number;
  limit?: number;
  page?: number;
}
