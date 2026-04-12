import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { RoleGuard } from 'src/common/auth/role.guard';
import { RoleEnum } from 'src/common/enum/role.enum';
import { ROLE_KEY } from './role.decorator';

export const Auth = (role?: RoleEnum[]) => {
  return applyDecorators(
    SetMetadata(ROLE_KEY, role),
    UseGuards(JwtAuthGuard, RoleGuard),
  );
};
