import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuoteModule } from './quote/quote.module';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [TypeOrmModule.forRoot(), QuoteModule, AuthorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
