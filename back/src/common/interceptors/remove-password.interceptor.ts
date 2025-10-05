import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => removePassword(data)));
  }
}
function removePassword(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removePassword);
  } else if (obj && typeof obj === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = obj;
    return rest;
  }
  return obj;
}
