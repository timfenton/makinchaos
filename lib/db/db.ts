import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const db = drizzle(neon(process.env.POSTGRES_URL!), { casing: 'snake_case'});

export default db;