import { Module } from '@nestjs/common';
import { EvaluationCriteriaController } from './evaluation-criteria.controller';
import { EvaluationCriteriaService } from './evaluation-criteria.service';
import { EvaluationCriteriaRepository } from './evaluation-criteria.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationCriteria } from './entities/evaluation-criteria.entity';
import { EvaluationCriteriaActivity } from './entities/evaluation-criteria-activity.entity';
import { EvaluationCriteriaActivityRepository } from './evaluation-criteria-activity.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvaluationCriteria, EvaluationCriteriaActivity]),
  ],
  controllers: [EvaluationCriteriaController],
  providers: [
    EvaluationCriteriaService,
    EvaluationCriteriaRepository,
    EvaluationCriteriaActivityRepository,
  ],
})
export class EvaluationCriteriaModule {}
