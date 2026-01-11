import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DonorsModule } from './donors/donors.module';
import { BloodRequestsModule } from './blood-requests/blood-requests.module';
import { DonationsModule } from './donations/donations.module';
import { BloodInventoryModule } from './blood-inventory/blood-inventory.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    DonorsModule,
    BloodRequestsModule,
    DonationsModule,
    BloodInventoryModule,
    StatsModule,
  ],
})
export class AppModule { }
