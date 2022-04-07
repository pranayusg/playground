import { Controller, Get } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthorService } from './author.service';

@ApiTags('Author')
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @ApiOkResponse({ description: 'Get all authors' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong on server' })
  @Get()
  findAll() {
    return this.authorService.findAll();
  }
}
