# tests

## Tests Project

This project uses the Playwright framework for API testing.

## Project setup

To set up the project, use the following commands:

### 1. Initialize Playwright

   ```bash
   npm init playwright@latest

   ```
### 2. Install dotenv (for managing environment variables)

    ```bash
    npm install dotenv --save-dev
    ```

## Compile and run the project 

### 1. Run Playwright Tests (To execute the Playwright tests)

    ```bash
    npx playwright test
    ```

#### 1. For dev env
    ```bash
    npm run test:dev

    ```
#### 2. For qa env
    ```bash
    npm run test:qa

    ```
#### 3. For prod env
    ```bash
    npm run test:prod

    ```

### 2. Run all tests (To run all tests in the project)

    ```bash
    npm test
    ```

## Project Structure

- tests/: Contains all test files.
- playwright.config.ts: Configuration for Playwright.
- env/.env: Environment variables files.

## Additional Resources

For more information on Playwright, visit the [official documentation](https://playwright.dev/docs/intro).

## Contributing

Please feel free to submit pull requests and raise issues.
**Creating and Running Database Tests**

1. Ensure your database is running locally.

2. Ensure you have a `.env` file with environment variables for database connection:

```
DB_HOST='devenvserver.database.windows.net'
DB_PORT=1433
DB_USER='dbadmin'
DB_PASSWORD='notpassword1@'
DB_NAME='devdb'
SERVERPORT=3000
EMAIL_PREFIX='IQAtest+'
EMAIL_DOMAIN='@gmail.com'
```