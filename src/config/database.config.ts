import { MongooseModuleOptions } from "@nestjs/mongoose";


export const databaseConfig = (): MongooseModuleOptions => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rewards-db',
  autoCreate: true,
  retryWrites: true,
  retryAttempts: 3,
  retryDelay: 1000,
});
