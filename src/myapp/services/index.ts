import { Database } from '@/infra/mongo';
import { makeChecMongoDataBase } from './check-db.service';

export const checkMongoDatabase = makeChecMongoDataBase(Database);
