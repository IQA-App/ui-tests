# ui-tests

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