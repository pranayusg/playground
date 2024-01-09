import { PartialType } from '@nestjs/swagger';
import { CreateTechTrainingDto } from './create-tech-training.dto';

export class UpdateTechTrainingDto extends PartialType(CreateTechTrainingDto) {}
