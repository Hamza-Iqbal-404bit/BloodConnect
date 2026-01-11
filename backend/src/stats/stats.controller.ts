import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
    constructor(private statsService: StatsService) { }

    @Get('admin')
    async getAdminStats() {
        return this.statsService.getAdminStats();
    }

    @Get('public')
    async getPublicStats() {
        return this.statsService.getPublicStats();
    }
}
