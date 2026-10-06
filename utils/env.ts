import dotenv from 'dotenv';

dotenv.config();

export const username = process.env.DEMOQA_USERNAME || '';
export const password = process.env.DEMOQA_PASSWORD || '';