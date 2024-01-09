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

- For environment variables check the **example.env.stage.dev** file and copy & paste the contents from the file into new file named **.env.stage.dev**
  - Edit the DB credentials as per your DB configuration.

## Running migration scripts

- Make sure before running the migrations build the project.

- Build the project

```cmd
npm run build
```

- Run migrations

```cmd
npm run migration:run
```

## Start the server

- Start in developmnet mode

```cmd
npm run start:dev
```

## Swagger

- http://localhost:4000/api

## Importing files

- Once FE is setup and logged in go to the **Import** page under **Imported-data** tab.
- Upload the files accoring to the dropdown menu order i.e. **Employee Master, Training Details, Certification**.
- Once uploaded, nevigate to **Jobs** page under **Imported-data** tab.
- The file processing Cron job rans every 30 seconds and it processes one file at a time.
- When all the files **status** is Completed, You can view the imported data from **raw-data** tables.

## Getting data into Normalized tables

- Once the files status is Completed, Open the Swagger UI, and excecute the /normalize route.
- This will transfer all the data from raw-data tables to normalized table with all relationships.
- **NOTE: This will take long time to complete, be patient.**
- Once the loading is completed of the /normalize route, you can check the tables under normalized tab will have data.

## Entities

1. `migrations_typeorm` - Details of migration scripts.
2. `job` - Details of the import jobs along with summary for jobs that are completed.
3. `raw_batch` - All the data from the **Batches** sheet from **Training details** Excel file.
4. `raw_training_dashboard` - All the data from the **Training Dashboard** sheet from **Training details** Excel file.
5. `raw_active_employee` - All the data from the **Active employees** sheet from **Employee Master** Excel file.
6. `raw_resigned_employee` - All the data from the **Resigned employees** sheet from **Employee Master** Excel file.
7. `raw_approved_certification` - All the data from the **Approved Certification** sheet from **Certification** Excel file.
8. `raw_achieved` - All the data from the **Achieved** sheet from **Certification** Excel file.
9. `raw_ongoing` - All the data from the **OnGoing** sheet from **Certification** Excel file.
10. `employee` - All the data from the **raw_active_employee** & **raw_resigned_employee** tables will be saved.
11. `batch` - All the data from the **raw_batch** tables will be saved along with CRUD operations.
12. `training_detail` - All the data from the **raw_training_dashboard** tables will be saved along with CRUD operations.
13. `certification_approved` - All the data from the **raw_approved_certification** tables will be saved along with CRUD operations.
14. `certification_achieved` - All the data from the **raw_achieved** tables will be saved along with CRUD operations.
15. `certification_ongoing` - All the data from the **raw_ongoing** tables will be saved along with CRUD operations.
16. `system_user` - All the users username and password will be stored in this table along with some other information.
17. `tech` - All the tech will be saved in this table.
18. `tech-training` - All the training names will be saved in this table.
19. `assignment-outline` - All the assignment related information will be saved in this table.
20. `batch-assignment-outline` - This is a junction table between batch nd assignment-outline.
21. `feedback-assignment` - All the feedbacks given by trainer for the trainees assignmnets will be saved here.
22. `question` - All the questions which will be used to send to the trainees to gether feedback regarding the batch and trainer.
23. `option` - Options for that perticular question.
24. `feedback_trainees_batch` - All the feedbacks given by trainees on the session will be stored in this table.
25. `report` - Table to store the data needed for the dashboard.
26. `evaluation_criteria` - Table to store the list of evaluation criteria which will be used to select from to assign to perticular assignment.
