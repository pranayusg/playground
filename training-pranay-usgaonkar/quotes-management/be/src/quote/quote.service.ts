import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from 'typeorm';

import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Quote } from './entities/quote.entity';
import { QuoteRepository } from './quote.repository';

@Injectable()
export class QuoteService {
  constructor(
    @InjectRepository(QuoteRepository)
    private quoteRepository: QuoteRepository,
  ) {}

  async create(createQuoteDto: CreateQuoteDto) {
    return await this.quoteRepository.createQuote(createQuoteDto);
  }

  async findAll() {
    return await this.quoteRepository.find({
      order: {
        author: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    return await this.quoteRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateQuoteDto: UpdateQuoteDto) {
    const existingTask = await this.quoteRepository.findOne({
      where: { id: id },
    });

    if (!existingTask) {
      throw new NotFoundException(
        `Quote with Id:${id} is not found in the database`,
      );
    }

    await this.quoteRepository.update({ id }, updateQuoteDto);
    return await this.quoteRepository.findOne({ id });
  }

  async remove(id: string) {
    const existingQuote = await this.quoteRepository.findOne({
      where: { id },
    });
    if (!existingQuote) {
      throw new NotFoundException(
        `Quote with Id:${id} is not found in the database`,
      );
    }
    const result = await this.quoteRepository.delete(id);
    if (result.affected) return { deleted: true };

    return { deleted: false };
  }

  async findAllAuthors() {
    return await this.quoteRepository.getUniqueAuthors();
  }

  async findByAuthor(author) {
    return await this.quoteRepository.find({ author: ILike(`%${author}%`) });
  }

  async findByTag(tag) {
    return await this.quoteRepository.find({ tags: ILike(`%${tag}%`) });
  }

  async findByTags(tags) {
    return await this.quoteRepository.findByTags(tags.split(';'));
  }

  async findByQuote(quote) {
    return await this.quoteRepository.find({ quote: ILike(`%${quote}%`) });
  }

  async likeUp(id) {
    return await this.quoteRepository.likeUp(id);
  }

  async dislikeUp(id) {
    return await this.quoteRepository.dislikeUp(id);
  }

  async likeDown(id) {
    return await this.quoteRepository.likeDown(id);
  }

  async dislikeDown(id) {
    return await this.quoteRepository.dislikeDown(id);
  }
}
