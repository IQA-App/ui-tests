import { v4 as uuidv4 } from 'uuid';

let number = uuidv4();

export const EMAILUSER = `${process.env.EMAIL_PREFIX}${number}${process.env.EMAIL_DOMAIN}`;
export const PASSWORDUSER = 'A' + number;
