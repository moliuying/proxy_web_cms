import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log("进入路由--");
        const now = Date.now();
        return next.handle()
            .pipe(
                tap(() => console.log(`Response Lag...${Date.now() - now}ms`))
            ).pipe(
                map((data) => {
                    return {
                        code: 200,
                        msg: '请求成功',
                        data: data
                    };
                }),
            );
    }
}
