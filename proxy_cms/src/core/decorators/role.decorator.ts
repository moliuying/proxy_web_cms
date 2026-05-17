import { SetMetadata } from '@nestjs/common';
import { Permission } from '../constants/role.constant';
import { ROLES_KEY, PERMISSIONS_KEY } from '../guard/role.guard';

export const Roles = (...roles: number[]) => SetMetadata(ROLES_KEY, roles);

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
