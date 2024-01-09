import { Module } from '@nestjs/common';
import { QuestionOptionService } from './question-option.service';
import { QuestionOptionController } from './question-option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionOption } from './entities/question-option.entity';
import { QuestionOptionRepository } from './question-option.repository';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionOption])],
  providers: [QuestionOptionService, QuestionOptionRepository],
  controllers: [QuestionOptionController],
})
export class QuestionOptionModule {}
