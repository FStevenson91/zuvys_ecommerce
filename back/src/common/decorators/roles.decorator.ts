import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/roles';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
