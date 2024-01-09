import { EntityManager, Repository, EntityTarget } from 'typeorm';
import { ActivityTracking } from '../entities/activity.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

export class BaseActivityTrackingRepository<T extends ActivityTracking> {
  private logger = new Logger(BaseActivityTrackingRepository.name);
  private repository: Repository<T>;

  constructor(entityManager: EntityManager, entity: EntityTarget<T>) {
    this.repository = entityManager.getRepository(entity);
  }

  async createRecord(
    userId: string,
    recordId: string,
    existingData: object,
    newData: object,
  ): Promise<T> {
    try {
      const entity = this.repository.create();
      entity.userId = userId;
      entity.recordId = recordId;
      entity.existingData = existingData;
      entity.newData = newData;

      return await this.repository.save(entity);
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BaseActivityTrackingRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
