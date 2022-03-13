import { Blog } from './blog';

export interface GetAllBlogsResponseDto {
  message: string;
  data?: {
    blogs: Blog[];
  };
}
