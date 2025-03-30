import { Database } from '@/infra/mongo';
import { makeChecMongoDataBase } from './check-db.service';
import { makeGeoServiceFake } from './geoServiceFake.service';
import { makeKycServiceFake } from './kycFake.service';
import { userMongoRepository } from '@/infra/repositories';
import { makeMailFakeService } from './mailFake.service';

export const checkMongoDatabase = makeChecMongoDataBase(Database);
export const geoFakeService = makeGeoServiceFake(userMongoRepository);
export const kycFakeService = makeKycServiceFake(userMongoRepository);
export const mailFakeService = makeMailFakeService(userMongoRepository);
