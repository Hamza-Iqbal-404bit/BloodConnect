import { Module, forwardRef } from '@nestjs/common';
import { BloodRequestsController } from './blood-requests.controller';
import { BloodRequestsService } from './blood-requests.service';
import { DonorsModule } from '../donors/donors.module';

@Module({
    imports: [forwardRef(() => DonorsModule)],
    controllers: [BloodRequestsController],
    providers: [BloodRequestsService],
    exports: [BloodRequestsService],
})
export class BloodRequestsModule { }
