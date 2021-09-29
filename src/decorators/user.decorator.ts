import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserEntity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => null
    // GqlExecutionContext.create(ctx).getContext().req.user
);
