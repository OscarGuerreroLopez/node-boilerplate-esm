import { Database } from '@/infra/mongo';
import { makeChecMongoDataBase } from './check-db.service';
import { makeGeoServiceFake } from './geoServiceFake.service';
import { makeKycServiceFake } from './kycFake.service';
import { userMongoRepository } from '@/infra/mongoRepositories';
import { makeMailFakeService } from './mailFake.service';
import { userSqlRepository } from '@/infra/sqlRepositories';

export const checkMongoDatabase = makeChecMongoDataBase(Database);
export const geoFakeService = makeGeoServiceFake(userMongoRepository, userSqlRepository);
export const kycFakeService = makeKycServiceFake(userMongoRepository, userSqlRepository);
export const mailFakeService = makeMailFakeService(userMongoRepository, userSqlRepository);
