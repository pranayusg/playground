import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { UpdateFeedbackTraineesBatchDto } from './dto/update-feedback-trainees-batch.dto';
import { FeedbackTraineesBatch } from './entities/feedback-trainees-batch.entity';
import { FeedbackTraineesBatchRepository } from './feedback-trainees-batch.repository';
import { TrainingDetailRepository } from 'src/training-detail/training-detail.repository';
import { BatchService } from 'src/batch/batch.service';
import { EmailService } from 'src/email/email.service';
import { CreateAllFeedbackTraineesBatchDto } from './dto/create-all-feedback-trainees-batch.dto';
import { QuestionType } from 'src/question/question-type.enum';
import { CreateFeedbackTraineesBatchDto } from './dto/create-feedback-trainees-batch.dto';
import { GenerateFormDto } from './dto/generate-form.dto';
import { IGetUser } from 'src/auth/get-user.interface';
import { Role } from 'src/core/enum/role.enum';

@Injectable()
export class FeedbackTraineesBatchService {
  constructor(
    private feedbackTraineesBatchRepo: FeedbackTraineesBatchRepository,
    private trainingDetailRepository: TrainingDetailRepository,
    private batchService: BatchService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async createFeedbackTraineesBatch(
    createAllFeedbackTraineesBatchDto: CreateAllFeedbackTraineesBatchDto,
    user: IGetUser,
  ): Promise<FeedbackTraineesBatch[]> {
    const { questions } = createAllFeedbackTraineesBatchDto;
    const result: FeedbackTraineesBatch[] = [];

    // Loop through questionId and answerOptionId arrays
    for (const response of questions) {
      const feedbackDto: CreateFeedbackTraineesBatchDto = {
        questionId: response.question,
        answerOptionId:
          response.question.questionType === QuestionType.MCQ
            ? response.answer
            : null,
        answerText:
          response.question.questionType === QuestionType.TEXT
            ? response.answer
            : null,
        batchId: createAllFeedbackTraineesBatchDto.batchId,
        empId: createAllFeedbackTraineesBatchDto.empId,
      };

      // Call createRecord function for each combination
      const feedbackRecord = await this.feedbackTraineesBatchRepo.createRecord(
        feedbackDto,
        user,
      );
      result.push(feedbackRecord);
    }

    return result;
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    batchId: string,
    user: IGetUser,
  ): Promise<PaginatedResponse> {
    let batchIds = [];
    if (batchId) {
      if (user.role === Role.TRAINEE) {
        throw new HttpException(
          {
            message: `Forbidden resource`,
            error: 'Forbidden',
            statusCode: HttpStatus.FORBIDDEN,
          },
          HttpStatus.FORBIDDEN,
        );
      }
      batchIds = await this.batchService.getParentChildBatchIds(batchId);
    }

    const res = await this.feedbackTraineesBatchRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      batchIds,
      user,
    );
    return res;
  }

  async getOne(id: string): Promise<FeedbackTraineesBatch> {
    return await this.feedbackTraineesBatchRepo.getOne(id);
  }

  async updateData(
    id: string,
    updateFeedbackTraineesBatchDto: UpdateFeedbackTraineesBatchDto,
    user: IGetUser,
  ): Promise<FeedbackTraineesBatch> {
    return await this.feedbackTraineesBatchRepo.updateData(
      id,
      updateFeedbackTraineesBatchDto,
      user,
    );
  }

  async deleteData(id: string): Promise<FeedbackTraineesBatch> {
    return await this.feedbackTraineesBatchRepo.deleteData(id);
  }

  async sendFeedbackEmail(id: string, generatformDto: GenerateFormDto) {
    const batch = await this.batchService.getOne(id);
    if (batch.formGenerated) {
      throw new BadRequestException(`Form already generated for the batch.`);
    }
    if (batch.status === 'Completed') {
      const batchEmployees: any =
        await this.trainingDetailRepository.getBatchEmployees(id);

      if (!batchEmployees.length) {
        throw new BadRequestException(`No employees belong to this batch.`);
      }
      for (const data of batchEmployees) {
        const payload = {
          username: data.empId.id,
          name: data.empId.name,
          batchId: data.batchId.id,
          batchName: `${data.batchId.batchTitle} : ${data.batchId.techTopic}`,
        };
        const expiryTime = `${generatformDto.validity}d`;
        const jwtToken = this.jwtService.sign(payload, {
          expiresIn: expiryTime,
        });

        this.emailService.sendSessionFeedbackMail(
          data.empId,
          jwtToken,
          data.batchId.techTopic,
          generatformDto.validity,
        );
      }
      await this.batchService.updateData(
        batch.id,
        { formGenerated: true },
        null,
      );
      return { message: `Check Email for the link` };
    } else {
      throw new BadRequestException(
        `Batch with ID: ${batch.id}, Title: ${batch.batchTitle}, Tech Topic: ${batch.techTopic} is not maked as Completed yet.`,
      );
    }
  }
}
