// @ts-nocheck
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader) return false;

    const token = authHeader.split(' ')[1]; // Bearer <token>

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      return true;
    } catch (e) {
      return false;
    }
  }
}
export {};
