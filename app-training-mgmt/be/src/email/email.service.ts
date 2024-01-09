import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Helper } from 'src/core/helpers';
import {
  APP_NAME,
  RESET_PASSWORD_EMAIL_SUBJECT,
  SET_PASSWORD_EMAIL_SUBJECT,
} from 'src/core/constant/constatnts';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  constructor(
    private mailerService: MailerService,
    private helper: Helper,
    private confiService: ConfigService,
  ) {}
  private FE_URL = this.confiService.get<string>('FE_BASE_URL');

  async sendSetPasswordMail(user: any, token: string, expiry: string) {
    const url = `${this.FE_URL}?token=${token}`;

    // Function to convert seconds to readable string
    const validityString = this.helper.formatExpiryTime(expiry);
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: SET_PASSWORD_EMAIL_SUBJECT,
        template: './set-password-template',
        context: {
          name: user.name,
          url,
          appName: APP_NAME,
          emailType: 'Set',
          validity: validityString,
        },
      });
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${EmailService.name}/sendSetPasswordMail`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async sendResetPasswordMail(user: any, token: string, expiry: string) {
    const url = `${this.FE_URL}?token=${token}`;

    // Function to convert seconds to readable string
    const validityString = this.helper.formatExpiryTime(expiry);
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: RESET_PASSWORD_EMAIL_SUBJECT,
        template: './set-password-template',
        context: {
          name: user.name,
          url,
          appName: APP_NAME,
          validity: validityString,
        },
      });
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${EmailService.name}/sendResetPasswordMail`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async sendSessionFeedbackMail(
    user: any,
    token: string,
    batchName: string,
    expiryTime: string,
  ) {
    const url = `${this.FE_URL}/session-feedback?token=${token}`;
    // Function to convert seconds to readable string

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: `Feedback for ${batchName} session.`,
        template: './send-trainer-feedback-template',
        context: {
          name: user.name,
          sessionName: batchName,
          url,
          appName: APP_NAME,
          validity: expiryTime,
        },
      });
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${EmailService.name}/sendSessionFeedbackMail`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
