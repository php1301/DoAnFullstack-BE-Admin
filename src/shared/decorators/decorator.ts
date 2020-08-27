import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/graphql.schema.generated';
import { GqlExecutionContext } from '@nestjs/graphql';

// Giống module.export (req, res, next) bên express
// Để access req và user objects dễ dàng từ graphql ctx thì ta có thể
// Tự tạo custom decorator(thực hiện các logic)
// Thay thế cho jwt.verify
// Chi tiết hơn tại: https://docs.nestjs.com/custom-decorators
export const ResGql = createParamDecorator(
  // (data, [root, args, ctx, info]): Response => ctx.res,
  (data: unknown, context: ExecutionContext): Response =>
    GqlExecutionContext.create(context).getContext().res,
);

export const GqlUser = createParamDecorator(
  // (data, [root, args, ctx, info]): User => ctx.req && ctx.req.user,
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req && ctx.req.user;
  },
);
