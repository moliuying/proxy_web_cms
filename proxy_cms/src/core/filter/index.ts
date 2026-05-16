import { ExceptionFilter, Catch, ArgumentsHost, HttpException,HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        console.log("enter 错误捕获")
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
        response
            .status(200)
            .json({
                code: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                msg: exception.message
            });
    }
}

@Catch(HttpException)
export class HTTPExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ht = host.switchToHttp()
        const res = ht.getResponse<Response>()

        const response = exception.getResponse()
        const code = typeof response === 'string' ? HttpStatus.INTERNAL_SERVER_ERROR : response['statusCode']
        const msg = typeof response === 'string' ? response : Array.isArray(response['message']) ? response['message'].join(',') : response['message']
        const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
        res.status(status).json({code, msg})
    }
}
