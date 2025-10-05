import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Role } from 'src/roles';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;
    if (!authorization) return false;

    const token = authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException('Bearer token no encontrado');

    try {
      const secret = process.env.JWT_SECRET;
      const user = this.jwtService.verify(token, { secret });
      if (!user.roles) {
        user.roles = user.isAdmin ? [Role.Admin] : [Role.User];
      }

      user.exp = new Date(user.exp * 1000);
      user.iat = new Date(user.iat * 1000);

      request.user = user;

      console.log(user);

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }
}
