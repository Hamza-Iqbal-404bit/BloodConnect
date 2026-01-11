import { Module } from '@nestjs/common';
import { BloodInventoryController } from './blood-inventory.controller';
import { BloodInventoryService } from './blood-inventory.service';

@Module({
    controllers: [BloodInventoryController],
    providers: [BloodInventoryService],
    exports: [BloodInventoryService],
})
export class BloodInventoryModule { }
