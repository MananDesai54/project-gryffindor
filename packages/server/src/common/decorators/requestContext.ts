import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const RequestContext = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.context;
});
