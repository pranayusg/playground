import { Module } from '@nestjs/common';
import { TechController } from './tech.controller';
import { TechService } from './tech.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tech } from './entities/tech.entity';
import { TechRepository } from './tech.repository';
import { TechTraining } from 'src/tech/entities/tech_training.entity';
import { TechTrainingRepository } from 'src/tech/tech-training.repository';
import { TechTrainingService } from 'src/tech/tech-training.service';
import { TechActivityRepository } from './tech-activity.repository';
import { TechActivity } from './entities/tech-activity.entity';
import { TechTrainingActivityRepository } from './tech-training-activity.repository';
import { TechTrainingActivity } from './entities/tech-training-activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tech,
      TechTraining,
      TechActivity,
      TechTrainingActivity,
    ]),
  ],
  controllers: [TechController],
  providers: [
    TechService,
    TechRepository,
    TechTrainingService,
    TechTrainingRepository,
    TechActivityRepository,
    TechTrainingActivityRepository,
  ],
})
export class TechModule {}
