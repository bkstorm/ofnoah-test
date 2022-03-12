import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { applicationDefault, App, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private defaultApp: App;

  constructor() {
    this.defaultApp = initializeApp({
      credential: applicationDefault(),
    });
  }

  async use(req: Request, res: Response, next: () => void) {
    const token = req.headers['authorization'];
    if (token) {
      try {
        const decodedToken = await getAuth().verifyIdToken(
          token.replace('Bearer ', ''),
        );
        const user = {
          email: decodedToken.email,
          uid: decodedToken.uid,
        };
        req['user'] = user;
        next();
        return;
      } catch (error) {
        throw new HttpException('Access denied!', HttpStatus.FORBIDDEN);
      }
    }
    next();
  }
}
