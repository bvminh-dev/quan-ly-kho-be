# Interceptor
- Yêu cầu: thống nhất data trả ra của backend (trường hợp thành công), theo định dạng format:
```js
{
    message: "",
    statusCode: "", //200 404
    data: ""
}
```

- trường hợp lỗi :

default:
```js
{
    statusCode: "",
    message: ""
}
```
nếu dùng custom message:
```js
{
    statusCode:"",
    message: "",
    error: ""
}
```
code mẫu:
```ts
//file: transform.interceptor.ts
import { Injectable,
NestInterceptor,
ExecutionContext,
CallHandler,
} from '@nestjs/common'; import {
Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface Response<T> {
    statusCode: number; message?:
    string;
    data: any;
}
@Injectable()
export class TransformInterceptor<T> implements
NestInterceptor<T, Response<T>> { intercept(
context: ExecutionContext,
next: CallHandler,
): Observable<Response<T>> {
    return next
        .handle()
        .pipe(
        map((data) => ({
            statusCode: context.switchToHttp().getResponse().statusCode,
            // message: data.message, data:
            data
        })),
    );
}
}
```