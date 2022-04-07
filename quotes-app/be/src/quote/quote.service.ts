import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ILike } from 'typeorm';

import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Quote } from './entities/quote.entity';
import { FavouriteQuoteRepository } from './favourite-quote.repositary';
import { QuoteRepository } from './quote.repository';

@Injectable()
export class QuoteService {
  constructor(
    @InjectRepository(QuoteRepository)
    private quoteRepository: QuoteRepository,
    private usersService: UsersService,
    private favouriteQuoteRepository: FavouriteQuoteRepository,
  ) {}

  async allTags() {
    const tagsData = await this.quoteRepository.allTags();

    const tags = tagsData.map((tagObj) =>
      tagObj.tags[tagObj.tags.length - 1] == ','
        ? tagObj.tags
        : tagObj.tags + ',',
    );
    const tagsCleaned = [
      ...new Set(
        tags
          .join('')
          .split(',')
          .map((n) => n.trim())
          .filter((n) => n),
      ),
    ];

    return tagsCleaned;
  }

  async myQuotes(id: string) {
    return await this.quoteRepository.find({
      where: { user: id },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async myFavQuotes(id: string) {
    return await this.favouriteQuoteRepository.find({
      where: { user: id, like: true },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async myUnFavQuotes(id: string) {
    return await this.favouriteQuoteRepository.find({
      where: { user: id, dislike: true },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async create(id: string, createQuoteDto: CreateQuoteDto) {
    const user = await this.usersService.findOne(id);
    return await this.quoteRepository.createQuote(user, createQuoteDto);
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

  async likeUp(userId, id) {
    const quote = await this.quoteRepository.likeUp(id);
    const unFavQuote = await this.favouriteQuoteRepository.checkFavQuote(
      userId,
      id,
    );
    if (unFavQuote.length > 0) {
      await this.favouriteQuoteRepository.updateUnFavQuote(userId, id);
      await this.quoteRepository.dislikeDown(id);
    } else {
      const user = await this.usersService.findOne(userId);
      await this.favouriteQuoteRepository.createFavQuote(user, quote);
    }
    return quote;
  }

  async dislikeUp(userId, id) {
    const quote = await this.quoteRepository.dislikeUp(id);
    const favQuote = await this.favouriteQuoteRepository.checkFavQuote(
      userId,
      id,
    );
    if (favQuote.length > 0) {
      await this.favouriteQuoteRepository.updateFavQuote(userId, id);
      await this.quoteRepository.likeDown(id);
    } else {
      const user = await this.usersService.findOne(userId);
      await this.favouriteQuoteRepository.createUnFavQuote(user, quote);
    }
    return quote;
  }

  async likeDown(userId, id) {
    const existingQuote = await this.favouriteQuoteRepository.findOne({
      where: { quote: id, user: userId },
    });
    if (!existingQuote) {
      throw new NotFoundException(
        `Quote with id:${id} and userId:${userId} is not found in the database`,
      );
    }
    await this.favouriteQuoteRepository.delete({ quote: id, user: userId });
    return await this.quoteRepository.likeDown(id);
  }

  async dislikeDown(userId, id) {
    const existingQuote = await this.favouriteQuoteRepository.findOne({
      where: { quote: id, user: userId },
    });
    if (!existingQuote) {
      throw new NotFoundException(
        `Quote with id:${id} and userId:${userId} is not found in the database`,
      );
    }
    await this.favouriteQuoteRepository.delete({ quote: id, user: userId });
    return await this.quoteRepository.dislikeDown(id);
  }
}
