import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { App, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private defaultApp: App;

  constructor() {
    this.defaultApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
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
