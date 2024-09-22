import { FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

module.exports = async () => {
    const env = process.env.ENVIRONMENT || 'dev';
    const envFilePath = path.resolve(__dirname, 'env', `${env}.env`);

    if (fs.existsSync(envFilePath)) {
        dotenv.config({ path: envFilePath, override: true });
        console.log(`Environment variables loaded from ${env}.env file`);
    } else {
        console.error(`Environment file for ${env} not found at ${envFilePath}`);
    }
};
