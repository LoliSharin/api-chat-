import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // временная реализация: берем x-user-id или Authorization: Bearer <id>
    const uid = req.headers['x-user-id'] as string || (() => {
      const auth = req.headers['authorization'] as string | undefined;
      if (auth?.startsWith('Bearer ')) return auth.slice(7);
      return undefined;
    })();

    if (!uid) {
      console.warn('Authorization token is missing or invalid');
      throw new UnauthorizedException('Authorization token is required');
    }

    (req as any).user = { id: uid };
    next();
  }
}