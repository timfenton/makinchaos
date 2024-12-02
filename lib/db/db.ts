import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.POSTGRES_URL ?? "postgres://default:s8vSDbgLn5lu@ep-round-bush-a4t587j3-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require");

const db = drizzle({client: sql, casing: 'snake_case'});

export default db;