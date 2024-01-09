import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Batch } from '../entities/batch.entity';
import { Tech } from 'src/tech/entities/tech.entity';

export class CreateBatchDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  batchTitle: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  techTopic: string;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trainingCoordinator: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  headTrainer: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty()
  parent?: Batch;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  feedbackComment: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  averageRatingsByTrainees: string;

  @ApiProperty()
  @IsOptional()
  noOfTrainees: number;

  @ApiProperty()
  @IsOptional()
  techId: Tech;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  formGenerated?: boolean;
}
