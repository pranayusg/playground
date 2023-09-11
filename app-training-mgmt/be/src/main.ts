import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  const configService: ConfigService = app.get<ConfigService>(ConfigService);

  const PORT = configService.get<number>('PORT');

  const config = new DocumentBuilder()
    .setTitle('Training Management Application')
    .setDescription(
      'Application to read training data from Excel file and generate reports.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(PORT);
  logger.log(`Applicaion running on Port: ${PORT}`);
}
bootstrap();
