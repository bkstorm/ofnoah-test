import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Article } from '../entities/article.entity';
import { CreateArticleDTO } from '../interfaces/create-article.dto';
import { UpdateArticleDto } from '../interfaces/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}

  async findAll(): Promise<Article[]> {
    return this.articleRepository.find({ order: { id: 'DESC' } });
  }

  async findArticleById(id: number): Promise<Article> {
    return this.articleRepository.findOne(id);
  }

  async createArticle(data: CreateArticleDTO): Promise<Article> {
    return this.articleRepository.save(data);
  }

  async updateArticle(data: UpdateArticleDto): Promise<Article> {
    return this.articleRepository.save(data);
  }

  async deleteArticle(id: number): Promise<DeleteResult> {
    return this.articleRepository.delete(id);
  }
}
