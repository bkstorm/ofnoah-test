import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { CreateBlogReponseDTO } from '../interfaces/create-blog-response.dto';
import { CreateBlogDTO } from '../interfaces/create-blog.dto';
import { User } from '../interfaces/user';

@Controller('blogs')
export class BlogController {
  constructor(@Inject('BLOG_SERVICE') private blogClient: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Post()
  async createBlog(
    @Body() data: CreateBlogDTO,
    @CurrentUser() user: User,
  ): Promise<CreateBlogReponseDTO> {
    return firstValueFrom(
      this.blogClient.send('create_blog', { ...data, userId: user.uid }),
    );
  }
}
