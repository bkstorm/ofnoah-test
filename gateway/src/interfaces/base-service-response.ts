export interface BaseServiceResponse {
  status: number;
  message: string;
  errors?: { [key: string]: any };
}
