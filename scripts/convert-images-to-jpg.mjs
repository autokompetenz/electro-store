// Convertit toutes les images produit (webp S3) en JPEG locaux, met a jour DB + CSV.
import pg, { default as _pg } from 'pg';
import sharp from '../../node_modules/.pnpm/sharp/lib/index.js';
