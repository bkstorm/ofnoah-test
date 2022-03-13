export interface ServiceBlogDeleteResponse {
  status: number;
  message: string;
  errors?: { [key: string]: any };
}
