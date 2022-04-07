import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class TagsQuery {

  @ApiProperty({ description: 'semicolon-separated values',default: 'Motivational;Action;' })
  tags: string;

}

export class TagQuery {

    @ApiProperty({ default: 'Motivational' })
    tag: string;
  
  }

  export class QuoteQuery {

    @ApiProperty()
    quote: string;
  
  }

  export class AuthorQuery {

    @ApiProperty()
    author: string;
  
  }
