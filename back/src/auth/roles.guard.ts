import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest(); // esta es la forma de acceder a la request en un guard, ya que no tenemos acceso directo a los decoradores como en los controladores, esto sirve para que el guard sea generico y pueda usarse en cualquier controlador
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const user = request.user;

    return requiredRoles.some((role) => user.roles.includes(role)); // aca el metodo some devuelve true si al menos uno de los roles del usuario esta en los roles requeridos, y false si ninguno coincide
  }
}
