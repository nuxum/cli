import { Module } from '@nuxum/core';
import { HelloController } from '../controllers/hello.controller';

@Module({
  controllers: [HelloController],
})
export class AppModule { }
