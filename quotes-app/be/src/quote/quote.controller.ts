import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthorQuery,
  QuoteQuery,
  TagQuery,
  TagsQuery,
} from './query/queryParams';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/users/get-user.decorator';

@ApiTags('Quote')
@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get('/alltags')
  async allTags() {
    return await this.quoteService.allTags();
  }

  @Get('/myquotes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async myQuotes(@GetUser() user) {
    return await this.quoteService.myQuotes(user.id);
  }

  @Get('/myfavquotes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async myFavQuotes(@GetUser() user) {
    return await this.quoteService.myFavQuotes(user.id);
  }

  @Get('/myunfavquotes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async myUnFavQuotes(@GetUser() user) {
    return await this.quoteService.myUnFavQuotes(user.id);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong on server',
  })
  @Patch('/:id/like/up')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async likeUp(@GetUser() user, @Param('id') id: string) {
    return await this.quoteService.likeUp(user.id, id);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong on server',
  })
  @Patch('/:id/dislike/up')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async dislikeUp(@GetUser() user, @Param('id') id: string) {
    return await this.quoteService.dislikeUp(user.id, id);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong on server',
  })
  @Patch('/:id/like/down')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async likeDown(@GetUser() user, @Param('id') id: string) {
    return await this.quoteService.likeDown(user.id, id);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong on server',
  })
  @Patch('/:id/dislike/down')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async dislikeDown(@GetUser() user, @Param('id') id: string) {
    return await this.quoteService.dislikeDown(user.id, id);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  @Get('/search/searchtags/tags')
  findByTags(@Query('tags') tags: TagsQuery) {
    return this.quoteService.findByTags(tags);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  @Get('/search/searchtag/tag')
  findByTag(@Query('tag') tag: TagQuery) {
    return this.quoteService.findByTag(tag);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  @Get('/search/quote')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findByQuote(@Query('quote') quote: QuoteQuery) {
    return this.quoteService.findByQuote(quote);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  @Get('/search')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findByAuthor(@Query('author') author: AuthorQuery) {
    return this.quoteService.findByAuthor(author);
  }

  @ApiCreatedResponse({ description: 'Success' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong on server',
  })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@GetUser() user, @Body() createQuoteDto: CreateQuoteDto) {
    return await this.quoteService.create(user.id, createQuoteDto);
  }

  @ApiOkResponse({ description: 'Get all quotes' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong on server',
  })
  @Get()
  findAll() {
    return this.quoteService.findAll();
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.quoteService.findOne(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateQuoteDto: CreateQuoteDto) {
    return this.quoteService.update(id, updateQuoteDto);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.quoteService.remove(id);
  }
}
