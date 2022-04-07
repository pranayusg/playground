import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthorQuery, QuoteQuery, TagQuery, TagsQuery } from './query/queryParams';

@ApiTags('Quote')
@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({description: 'Quote not found'})
  @ApiInternalServerErrorResponse({ description: 'Something went wrong on server' })
  @Patch('/:id/like/up')
  async likeUp(@Param('id') id: string) {
    return await this.quoteService.likeUp(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({description: 'Quote not found'})
  @ApiInternalServerErrorResponse({ description: 'Something went wrong on server' })
  @Patch('/:id/dislike/up')
  async dislikeUp(@Param('id') id: string) {
    return await this.quoteService.dislikeUp(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({description: 'Quote not found'})
  @ApiInternalServerErrorResponse({ description: 'Something went wrong on server' })
  @Patch('/:id/like/down')
  async likeDown(@Param('id') id: string) {
    return await this.quoteService.likeDown(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({description: 'Quote not found'})
  @ApiInternalServerErrorResponse({ description: 'Something went wrong on server' })
  @Patch('/:id/dislike/down')
  async dislikeDown(@Param('id') id: string) {
    return await this.quoteService.dislikeDown(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({description: 'Quote not found'})
  @Get('/search/searchtags/tags')
  findByTags(@Query('tags') tags :TagsQuery ) {
    return this.quoteService.findByTags(tags);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({description: 'Quote not found'})
  @Get('/search/searchtag/tag')
  findByTag(@Query('tag') tag :TagQuery) {
    return this.quoteService.findByTag(tag);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({description: 'Quote not found'})
  @Get('/search/quote')
  findByQuote(@Query('quote') quote :QuoteQuery) {
    return this.quoteService.findByQuote(quote);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({description: 'Quote not found'})
  @Get('/search')
  findByAuthor(@Query('author') author: AuthorQuery) {
    return this.quoteService.findByAuthor(author);
  }

  @ApiCreatedResponse({ description: 'Success' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong on server' })
  @Post()
  async create(@Body() createQuoteDto: CreateQuoteDto) {
    return await this.quoteService.create(createQuoteDto);
  }

  @ApiOkResponse({ description: 'Get all quotes' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong on server' })
  @Get()
  findAll() {
    return this.quoteService.findAll();
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({description: 'Quote not found'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quoteService.findOne(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({description: 'Quote not found'})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuoteDto: CreateQuoteDto) {
    return this.quoteService.update(id, updateQuoteDto);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({description: 'Quote not found'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quoteService.remove(id);
  }
}
