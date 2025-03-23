import { Database } from '@/infra/mongo';
import { makeChecMongoDataBase } from './check-db.service';
import { makeGeoServiceFake } from './geoServiceFake.service';
import { makeKycServiceFake } from './kycFake.service';
import { userRepository } from '@/infra/repositories';
import { makeMailFakeService } from './mailFake.service';

export const checkMongoDatabase = makeChecMongoDataBase(Database);
export const geoFakeService = makeGeoServiceFake(userRepository);
export const kycFakeService = makeKycServiceFake(userRepository);
export const mailFakeService = makeMailFakeService(userRepository);
