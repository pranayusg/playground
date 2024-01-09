import { PartialType } from '@nestjs/swagger';
import { CreateOnGoingDto } from './create-ongoing.dto';

export class UpdateOnGoingDto extends PartialType(CreateOnGoingDto) {}
