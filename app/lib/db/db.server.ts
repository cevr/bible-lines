import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import { Env } from '../env.server';
import * as schema from './schema.server';

// Create the connection
const client = createClient({ url: Env.DB_URL, authToken: Env.DB_AUTH_TOKEN });

export const db = drizzle(client, { schema });
