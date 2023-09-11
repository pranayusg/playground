# Training Management Application

App to Read Training data from excel file and generate reports

## Phase 1: Import the Training Dashboard Excel sheet maintained by the training team into appropriate tables.

- Create required tables to capture the data from the excel sheet, create a flat table to mimic the excel files for all raw data.
- Allow importing the files multiple times. Do not create new records, if the data rows are not changed.
- Update the database table row record to match the newly imported rows.
- API endpoint to upload the excel file to create import Job.
- API endpoint to check the status of the job, given the JobID.
- API endpoint should be available to view the summary of imported data for each file import job.
- API endpoint should be available to view all imported data.

## Details for Phase 1:

- The Excel file which is provided has 2 sheets that needs to be imported. So, there must be 2 tables for 2 sheets with same column names as per the Excel sheets.

- There must be a logic wherein the user can import the file multiple times and system needs to check if there are any changes made in any row. If no, nothing should be added. If yes, it should only add those which are new. And if anything is updated which were already present in the table then it should update that.

- As soon as an Excel file is imported a job will be created. And a Cron job will handle all the data import functionality in the background.

- User will be able to check the status of that Job by passing the JobID. Which will give the user the status like is that **Completed** or **Pending**.

- User will be able to view how many rows are created, how many rows are updated, how many are rejected.

- 2 endpoints to view the imported data from each table.

- When uploading the Excel file, the file should have the mentioned 2 sheets, i.e. **Batches** & **Training Dashboard** for phase 1. Otherwise application will not process the data.

- If any rows are rejected from any sheets, another Excel file will be generated with the same 2 sheets and the rows that are rejected with the reason for the rejection in thier respective sheets.

## Entities

1. `job` - Details of the import jobs along with summary for jobs that are completed.
2. `raw_batch` - All the data from the **Batches** sheet from **Overall Training details** Excel file.
3. `raw_training_dashboard` - All the data from the **Training Dashboard** sheet from **Overall Training details** Excel file.
4. `raw_active_employee` - All the data from the **Active employees** sheet from **Employee Master** Excel file.
5. `raw_resigned_employee` - All the data from the **Resigned employees** sheet from **Employee Master** Excel file.
