import { Module, forwardRef } from '@nestjs/common';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';
import { BloodRequestsModule } from '../blood-requests/blood-requests.module';

@Module({
    imports: [forwardRef(() => BloodRequestsModule)],
    controllers: [DonorsController],
    providers: [DonorsService],
    exports: [DonorsService],
})
export class DonorsModule { }
