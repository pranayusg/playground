import { Injectable } from '@nestjs/common';
import { QuoteService } from 'src/quote/quote.service';

@Injectable()
export class AuthorService {
  constructor(private quoteService: QuoteService) {}

  async findAll() {
    return await this.quoteService.findAllAuthors();
  }
}
