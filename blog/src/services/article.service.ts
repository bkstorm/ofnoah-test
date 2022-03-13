import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { applicationDefault, App, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { Article } from '../entities/article.entity';
import { CreateArticleDTO } from '../interfaces/create-article.dto';
import { UpdateArticleDto } from '../interfaces/update-article.dto';

@Injectable()
export class ArticleService {
  private defaultApp: App;

  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    private connection: Connection,
  ) {
    this.defaultApp = initializeApp({
      credential: applicationDefault(),
    });
  }

  async findAll(): Promise<Article[]> {
    return this.articleRepository.find({ order: { id: 'DESC' } });
  }

  async findArticleById(id: number): Promise<Article> {
    return this.articleRepository.findOne(id);
  }

  async createArticle(data: CreateArticleDTO): Promise<Article> {
    return this.connection.transaction(async (em) => {
      const article = await em.getRepository(Article).save(data);
      const doc = getFirestore()
        .collection('article')
        .doc(article.id.toString());
      await doc.create(article);
      return article;
    });
  }

  async updateArticle(data: UpdateArticleDto): Promise<Article> {
    return this.connection.transaction(async (em) => {
      const article = await em.getRepository(Article).save(data);
      const doc = getFirestore()
        .collection('article')
        .doc(article.id.toString());
      await doc.update(article);
      return article;
    });
  }

  async deleteArticle(id: number): Promise<DeleteResult> {
    return this.connection.transaction(async (em) => {
      const deleteResult = await em.getRepository(Article).delete(id);
      const doc = getFirestore().collection('article').doc(id.toString());
      await doc.delete();
      return deleteResult;
    });
  }
}
