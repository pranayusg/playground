import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteRepository } from './quote.repository';
import { UsersModule } from 'src/users/users.module';
import { FavouriteQuoteRepository } from './favourite-quote.repositary';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuoteRepository, FavouriteQuoteRepository]),
    UsersModule,
  ],
  controllers: [QuoteController],
  providers: [QuoteService],
  exports: [QuoteService],
})
export class QuoteModule {}
