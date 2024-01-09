import * as dotenv from 'dotenv';

export const ENV_FILE_PATH = `./.env.stage.${process.env.STAGE}`;

dotenv.config({ path: ENV_FILE_PATH });

export const CHECK_NEW_JOBS_CRON_T = process.env.CRON_T_CHECK_NEW_JOBS;

export const GENERATE_REPORT_CRON_T = process.env.CRON_T_GENERATE_REPORT;

export const NORMALIZE_CRON_T = process.env.CRON_T_NORMALIZE;

export const API_VERSION = process.env.API_VERSION;

export const API_VERSIONING_HEADER = process.env.API_VERSIONING_HEADER;

export const CACHE_TTL_ENV = 'CACHE_TTL';

export const ADMIN_ID_ENV = 'ADMIN_ID';
