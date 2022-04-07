import { EntityRepository, Repository } from 'typeorm';
import { Quote } from './entities/quote.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { getRepository, getManager } from 'typeorm';

@EntityRepository(Quote)
export class QuoteRepository extends Repository<Quote> {
  async createQuote(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    const newQuote = this.create(createQuoteDto);
    await this.save(newQuote);
    return newQuote;
  }

  async getUniqueAuthors() {
    return await getRepository(Quote)
      .createQueryBuilder()
      .select('author')
      .groupBy('author')
      .getRawMany();
  }

  async findByTags(tags) {
    const entityManager = getManager();
    const tagsFiltered = tags.filter((el) => el != '');

    const count = tagsFiltered.length;
    let str = `tags LIKE `;
    let condition = 'WHERE ';

    for (let i = 0; i < count; i++) {
      if (i === count - 1)
        condition = condition + str + `'%${tagsFiltered[i]}%' `;
      else condition = condition + str + `'%${tagsFiltered[i]}%' AND `;
    }

    const data = await entityManager.query(
      `select * from public."Quotes" ${condition}`,
    );

    return data;
  }

  async likeUp(id) {
    const entityManager = getManager();

    await entityManager.query(
      `update public."Quotes" set likes=likes+1
      where id='${id}'`,
    );

    return await this.findOne({
      where: { id },
    });
  }

  async dislikeUp(id) {
    const entityManager = getManager();

    await entityManager.query(
      `update public."Quotes" set dislikes=dislikes+1
      where id='${id}'`,
    );

    return await this.findOne({
      where: { id },
    });
  }

  async likeDown(id) {
    const entityManager = getManager();

    await entityManager.query(
      `update public."Quotes" set likes=case when likes > 0 then likes-1 else likes end
      where id='${id}'`,
    );

    return await this.findOne({
      where: { id },
    });
  }

  async dislikeDown(id) {
    const entityManager = getManager();

    await entityManager.query(
      `update public."Quotes" set dislikes=case when dislikes > 0 then dislikes-1 else dislikes end
      where id='${id}'`,
    );

    return await this.findOne({
      where: { id },
    });
  }
}
