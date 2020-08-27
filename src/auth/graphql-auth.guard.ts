import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
// Nếu muốn sử dụng trực tiếp ko thông qua decorator GqlUser()
// Hoặc tự config được github strategy thì xài uncomment dòng dưới
// export class GqlAuthGuard extends AuthGuard(['jwt','facebook-token, google']) {
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
