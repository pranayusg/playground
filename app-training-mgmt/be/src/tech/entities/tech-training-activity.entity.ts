import { ActivityTracking } from 'src/core/entities/activity.entity';
import { Entity } from 'typeorm';

@Entity()
export class TechTrainingActivity extends ActivityTracking {}