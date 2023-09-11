# Training Management Application Backend.

- This is developed using NestJS and PostgreSQL.

## Prerequisties

- Make sure the docker is running with postgres.
- Install all the app dependencies using command

```cmd
npm install
```

OR

```cmd
npm i
```

- Change the DB configurations in src/config/database-config.ts

## Start the server

- Start in developmnet mode

```cmd
npm run start:dev
```

- Build the project

```cmd
npm run build
```

## Running migration scripts

- Run migrations

```cmd
npm run migration-run
```

- Generate migration

```cmd
npm run migration:generate -n src/migrations/<Name for the migration file>
```

## Entities

1. `migrations_typeorm` - Details of migration scripts.
2. `job` - Details of the import jobs along with summary for jobs that are completed.
3. `raw_batch` - All the data from the **Batches** sheet from **Training details** Excel file.
4. `raw_training_dashboard` - All the data from the **Training Dashboard** sheet from **Training details** Excel file.
5. `raw_active_employee` - All the data from the **Active employees** sheet from **Employee Master** Excel file.
6. `raw_resigned_employee` - All the data from the **Resigned employees** sheet from **Employee Master** Excel file.
