import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './core/interceptor'
import { HttpExceptionFilter } from './core/filter'
import { AuthGuard } from './core/guard'
import {rateLimit}  from 'express-rate-limit'  //为了保护您的应用程序免受暴力攻击，您必须实现某种速率限制。幸运的是，NPM上已经有很多各种中间件可用。其中之一是快速限价。

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.setGlobalPrefix('hetu'); // 全局路由前缀
    // app.enableCors({
    //     origin: ['http://localhost:7788',
    //         // 'http://beijihunb.com','https://beijihunb.com',
    //         'http://xiaohouzihjj.com',
    //         'https://xiaohouzihjj.com'],
    //     methods: 'GET,POST',
    //     credentials: true
    // })
    app.enableCors({
            origin: [
                'http://localhost:7788',
                'http://bianselongzw.com',
                'https://bianselongzw.com',
                'http://www.bianselongzw.com',
                'https://www.bianselongzw.com',
            ], // 或使用函数动态允许
        methods: 'GET,POST',
        credentials: true
    });
    app.use(rateLimit({
        windowMs: 60 * 1000, // 60S
        max: 100 // limit each IP to 100 requests per windowMs
    }))
    app.useGlobalInterceptors(new LoggingInterceptor())
    app.useGlobalFilters(new HttpExceptionFilter())
    // app.useGlobalGuards(new AuthGuard(100))
    await app.listen(4000);
}

bootstrap();
