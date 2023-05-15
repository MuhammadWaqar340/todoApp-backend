// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(2000);
// }
// bootstrap();
import compression from '@fastify/compress';
import { fastifyHelmet } from '@fastify/helmet';
import {
  InternalServerErrorException,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import { contentParser } from 'fastify-multer';

declare const module: any;

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({ logger: true }),
    );

    // await app.register(fastifyHelmet)
    await app.register(fastifyHelmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
      crossOriginResourcePolicy: false,
    });

    app.register(compression);
    app.register(contentParser);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useStaticAssets({ root: join(__dirname, '../') });
    // app.use(new HttpExceptionFilter())
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Next Supply Chain Management')
      .setDescription('The NSCM Swagger APIs ')
      .setVersion('3.0')
      .addTag('NSCM')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
    await app.listen(5000);
    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  } catch (error) {
    Logger.error(`Error starting server, ${error}`, '', 'Bootstrap', false);
    process.exit();
  }
}
bootstrap();
