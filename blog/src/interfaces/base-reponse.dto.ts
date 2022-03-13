export interface BaseResponseDto {
  status: number;
  message: string;
  errors?: { [key: string]: any };
}
