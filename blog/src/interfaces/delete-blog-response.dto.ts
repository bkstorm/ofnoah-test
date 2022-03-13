export interface DeleteBlogResponseDto {
  status: number;
  message: string;
  errors?: { [key: string]: any };
}
