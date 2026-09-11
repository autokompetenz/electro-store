import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (existsSync(path.join(__dirname, '.env'))) dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });