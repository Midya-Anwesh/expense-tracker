import { Module } from '@nestjs/common';
import { ExpencesService } from './expences.service';
import { ExpencesController } from './expences.controller';

@Module({
  providers: [ExpencesService],
  controllers: [ExpencesController]
})
export class ExpencesModule {}
