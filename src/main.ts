import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Storage } from '@google-cloud/storage';
import * as cookieParser from 'cookie-parser';
declare const module: any;

/*
b5d0a008cf519a1 IMGUR-CLIENT-ID
3ea43436606668ef1ccacd618052aebf9127b943
*/

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://172.29.112.1:3000'],
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 4000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
