import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.POSTGRES_URL!);

const db = drizzle({client: sql, casing: 'snake_case'});

export default db;