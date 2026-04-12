import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/common/enum/role.enum';

export const ROLE_KEY = 'role';

export const Role = (roles: RoleEnum[]) => SetMetadata(ROLE_KEY, roles);
