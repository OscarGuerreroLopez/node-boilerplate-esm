import { Database } from '@/infra/mongo';
import { makeChecMongoDataBase } from './check-db.service';
import { makeGeoServiceFake } from './geoServiceFake.service';
import { userRepository } from '@/infra/repositories';
import { updateUserUsecase } from '../usecases';

export const checkMongoDatabase = makeChecMongoDataBase(Database);
export const geoFakeService = makeGeoServiceFake(userRepository, updateUserUsecase);
