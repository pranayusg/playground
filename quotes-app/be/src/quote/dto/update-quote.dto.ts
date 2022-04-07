import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateQuoteDto } from './create-quote.dto';
import { IsInt } from 'class-validator';

export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {}
