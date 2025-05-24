import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      console.log('[RolesGuard] No roles required');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      console.log('[RolesGuard] No user or role found');
      return false;
    }

    const userRole = user.role.toLowerCase();
    const allowedRoles = requiredRoles.map(r => r.toLowerCase());

    console.log('[RolesGuard] user.role:', userRole);
    console.log('[RolesGuard] allowedRoles:', allowedRoles);

    return allowedRoles.includes(userRole);
  }
}
