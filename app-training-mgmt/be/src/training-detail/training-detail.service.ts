import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TrainingDetailRepository } from './training-detail.repository';
import { TrainingDetail } from './entities/training-detail.entity';
import { CreateTrainingDetailDto } from './dto/create-training-detail.dto';
import { UpdateTrainingDetailDto } from './dto/update-training-detail.dto';
import { RawTrainingDashboardRepository } from 'src/raw-data/overall-training/raw-training-dashboard.repository';
import { BatchRepository } from 'src/batch/batch.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { Employee } from 'src/employee/entities/employee.entity';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { EmployeeStatus } from 'src/employee/employee-status.enum';
import { ILike } from 'typeorm';
import { CreateBatchDto } from 'src/batch/dto/create-batch.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { IGetUser } from 'src/auth/get-user.interface';
import {
  NA,
  NO_CLIENT,
  NO_DATA_MESSAGE,
  TRAINEE,
} from 'src/core/constant/constatnts';

@Injectable()
export class TrainingDetailService {
  private logger = new Logger('TrainingDetailService');
  constructor(
    private trainingDetailRepository: TrainingDetailRepository,
    private rawTrainingDashboardRepo: RawTrainingDashboardRepository,
    private batchRepo: BatchRepository,
    private employeeRepo: EmployeeRepository,
  ) {}

  async createTrainingDetail(
    createTrainingDetailDto: CreateTrainingDetailDto,
    user: IGetUser,
  ): Promise<TrainingDetail> {
    return await this.trainingDetailRepository.createRecord(
      createTrainingDetailDto,
      user,
    );
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    empId: string,
    supId: string,
    clientName: string,
    orderBy: string,
    order: string,
    user: IGetUser,
    batchStatus: string,
  ): Promise<PaginatedResponse> {
    return await this.trainingDetailRepository.getAll(
      pageNo,
      noOfRecords,
      empId,
      supId,
      clientName,
      orderBy,
      order,
      user,
      batchStatus,
    );
  }

  async getOne(id: string): Promise<TrainingDetail> {
    return await this.trainingDetailRepository.getOne(id);
  }

  async updateData(
    id: string,
    updateTrainingDetailDto: UpdateTrainingDetailDto,
    user: IGetUser,
  ): Promise<TrainingDetail> {
    return await this.trainingDetailRepository.updateData(
      id,
      updateTrainingDetailDto,
      user,
    );
  }

  async deleteData(id: string): Promise<TrainingDetail> {
    return await this.trainingDetailRepository.deleteData(id);
  }

  async transferRawData() {
    try {
      const rawTrainingDashboardData = await this.rawTrainingDashboardRepo.find(
        {
          where: { isProcessed: false },
          order: { empId: OrderValue.ASC },
        },
      );

      if (rawTrainingDashboardData.length === 0) {
        this.logger.log(NO_DATA_MESSAGE);
        return {
          message: NO_DATA_MESSAGE,
        };
      }

      const newData: CreateTrainingDetailDto = new CreateTrainingDetailDto();

      for (const data of rawTrainingDashboardData) {
        const convertedTrainingStartDate = this.convertDate(
          data.trainingStartDate,
        );

        const batch = await this.batchRepo.findBatch(
          data.batchType,
          data.batchTypeDescription,
          convertedTrainingStartDate,
        );

        let employee: Employee;
        if (data.empId == TRAINEE) {
          // Find the last trainee's index number
          const lastTrainee = await this.employeeRepo.findOne({
            where: { id: ILike(`${TRAINEE}%`) },
            order: { id: OrderValue.DESC },
          });

          const sameTrainee = await this.employeeRepo.findOne({
            where: { id: ILike(`${TRAINEE}%`), name: data.name },
          });
          if (sameTrainee) {
            newData.batchId = batch.id;
            newData.empId = sameTrainee.id;
            await this.trainingDetailRepository.createRecord(newData, null);
            await this.rawTrainingDashboardRepo.updateData(data, {
              isProcessed: true,
            });
            continue;
          }

          // Calculate the new trainee's index number
          let newIndex = 1;
          if (lastTrainee && lastTrainee.id) {
            const lastTraineeIndex = parseInt(
              lastTrainee.id.match(/\d+$/)[0],
              10,
            );
            newIndex = lastTraineeIndex + 1;
          }

          const reportingToEmployee = await this.employeeRepo.findOne({
            where: { name: ILike(`%${data.reportingManager}%`) },
          });

          const newTraineeData = new CreateEmployeeDto();

          if (reportingToEmployee) {
            newTraineeData.reportingTo = reportingToEmployee.id;
          }

          newTraineeData.id = `${TRAINEE}-${newIndex}`;
          newTraineeData.name = data.name;
          newTraineeData.email = NA;
          newTraineeData.currDesignation = TRAINEE;
          newTraineeData.currClient1 = NO_CLIENT;
          newTraineeData.coreTechStack = NA;
          newTraineeData.status = EmployeeStatus.Exit;

          await this.employeeRepo.createRecord(newTraineeData);

          await this.createOrUpdateTrainingDetail(
            data,
            batch,
            newTraineeData.id,
          );

          await this.rawTrainingDashboardRepo.updateData(data, {
            isProcessed: true,
          });
          continue;
        } else {
          employee = await this.employeeRepo.getOneEmployee(data.empId);
        }

        if (batch !== null) {
          await this.createOrUpdateTrainingDetail(data, batch, employee.id);

          await this.rawTrainingDashboardRepo.updateData(data, {
            isProcessed: true,
          });
        } else {
          const batchWithChildren =
            await this.batchRepo.getBatchesWithChildrenValue(
              data.batchType,
              data.batchTypeDescription,
            );

          if (Object.keys(batchWithChildren).length === 0) {
            const formatedBatchTypeDescription = this.removeGPart(
              data.batchTypeDescription,
            );
            const parentBatch = await this.batchRepo.findBatch(
              data.batchType.trimEnd(),
              formatedBatchTypeDescription.trimEnd(),
              convertedTrainingStartDate,
            );

            const newChildBatch = new CreateBatchDto();
            newChildBatch.batchTitle = data.batchType;
            newChildBatch.techTopic = data.batchTypeDescription;
            newChildBatch.startDate = data.trainingStartDate;
            newChildBatch.endDate = data.trainingEndDate;
            newChildBatch.trainingCoordinator = parentBatch.trainingCoordinator;
            newChildBatch.headTrainer = data.trainer;
            newChildBatch.status = data.batchStatus;
            newChildBatch.parent = parentBatch;

            const createdChildBatch = await this.batchRepo.save(newChildBatch);

            await this.createOrUpdateTrainingDetail(
              data,
              createdChildBatch,
              employee.id,
            );

            await this.rawTrainingDashboardRepo.updateData(data, {
              isProcessed: true,
            });
          } else if (Object.keys(batchWithChildren).length !== 0) {
            const childBatchId = batchWithChildren.children.filter(
              (child) =>
                child.techTopic === data.batchType &&
                child.batchTitle === data.batchTypeDescription,
            );

            if (childBatchId) {
              await this.createOrUpdateTrainingDetail(
                data,
                childBatchId,
                employee.id,
              );
              await this.rawTrainingDashboardRepo.updateData(data, {
                isProcessed: true,
              });
            }
          }
        }
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${TrainingDetailService.name}/transferRawData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async createOrUpdateTrainingDetail(data, batch, empId) {
    const existingTrainingDetail: any =
      await this.trainingDetailRepository.findExisting(batch.id, empId);

    if (!existingTrainingDetail) {
      const newData = new CreateTrainingDetailDto();
      newData.batchId = batch.id;
      newData.empId = empId;
      await this.trainingDetailRepository.createRecord(newData, null);
    } else {
      if (
        batch.batchTitle !== data.batchType ||
        batch.techTopic !== data.batchTypeDescription ||
        batch.startDate !== data.trainingStartDate ||
        batch.endDate !== data.trainingEndDate ||
        batch.trainingCoordinator !== data.trainingCoordinator ||
        batch.headTrainer !== data.trainer ||
        batch.status !== data.status
      ) {
        // Update the batch entity with the new values
        batch.batchTitle = data.batchType;
        batch.techTopic = data.batchTypeDescription;
        batch.startDate = data.trainingStartDate;
        batch.endDate = data.trainingEndDate;
        batch.headTrainer = data.trainer;
        batch.status = data.batchStatus;

        // Save the updated batch entity
        await this.batchRepo.updateData(
          existingTrainingDetail.batchId.id,
          batch,
          null,
        );
      }
    }
  }

  convertDate(inputDateString: Date) {
    const inputDate = new Date(inputDateString);

    const year = inputDate.getUTCFullYear();
    const month = inputDate.getUTCMonth() + 1;
    const day = inputDate.getUTCDate();
    const hours = 5;
    const minutes = 30;
    const seconds = 0;

    const outputDateString = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')} ${hours}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return outputDateString;
  }

  removeGPart(inputString: string): string {
    // Use regular expression to remove G1, G2, G3, G4, G5, etc.
    const regex = /(G\d+)\s*/gi;
    const result = inputString.replace(regex, '');

    // Remove whitespace before a colon
    const updatedResult = result.replace(/\s*:/g, ':');

    return updatedResult;
  }

  async getNoOfTrained(period: number, requiredDate: Date) {
    return await this.trainingDetailRepository.countOfTraining(
      period,
      requiredDate,
    );
  }
}
