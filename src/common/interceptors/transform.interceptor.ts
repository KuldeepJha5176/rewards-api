import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  export interface Response<T> {
    data: T;
    statusCode: number;
    message?: string;
  }
  
  @Injectable()
  export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>>
  {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<Response<T>> {
      const request = context.switchToHttp().getRequest();
      const statusCode = context.switchToHttp().getResponse().statusCode;
  
      return next.handle().pipe(
        map((data) => ({
          data,
          statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
        })),
      );
    }
  }