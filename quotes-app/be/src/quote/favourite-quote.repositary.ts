import { User } from 'src/users/entities/user.entity';
import { EntityRepository, getManager, Repository } from 'typeorm';
import { FavouriteQuote } from './entities/favourite-quote.entity';
import { Quote } from './entities/quote.entity';

@EntityRepository(FavouriteQuote)
export class FavouriteQuoteRepository extends Repository<FavouriteQuote> {
  async createFavQuote(user: User, quote: Quote): Promise<FavouriteQuote> {
    const newFavQuote = this.create({ user, quote, like: true });
    await this.save(newFavQuote);
    return newFavQuote;
  }

  async createUnFavQuote(user: User, quote: Quote): Promise<FavouriteQuote> {
    const newFavQuote = this.create({ user, quote, dislike: true });
    await this.save(newFavQuote);
    return newFavQuote;
  }

  async checkFavQuote(userId, quoteId): Promise<any> {
    return await this.find({
      where: { user: userId, quote: quoteId },
    });
  }

  async updateFavQuote(userId, quoteId): Promise<any> {
    const entityManager = getManager();
    await entityManager.query(
      `update public."favouriteQuote" set "like"=false ,"dislike"=true where "userId"='${userId}' and "quoteId"='${quoteId}'`,
    );
    return await this.findOne({
      where: { user: userId, quote: quoteId },
    });
  }

  async updateUnFavQuote(userId, quoteId): Promise<any> {
    const entityManager = getManager();
    await entityManager.query(
      `update public."favouriteQuote" set "like"=true ,"dislike"=false where "userId"='${userId}' and "quoteId"='${quoteId}'`,
    );
    return await this.findOne({
      where: { user: userId, quote: quoteId },
    });
  }
}
