import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // validar si el request tiene un header authorization
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers;

    const authorization = authHeader.authorization;

    if (!authorization) return false;

    return true;
  }
}
