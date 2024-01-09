import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { SystemUser } from 'src/system-user/entities/system-user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): SystemUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
