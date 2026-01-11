import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { BloodRequestsService } from './blood-requests.service';
import { CreateBloodRequestDto, UpdateApprovalDto, UpdateStatusDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('blood-requests')
export class BloodRequestsController {
    constructor(private bloodRequestsService: BloodRequestsService) { }

    @Get()
    async findAll() {
        return this.bloodRequestsService.findAll();
    }

    @Get('active')
    async findActive() {
        return this.bloodRequestsService.findActive();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Body() createDto: CreateBloodRequestDto,
        @CurrentUser() user: any,
    ) {
        return this.bloodRequestsService.create(createDto, user.userId);
    }

    @Patch(':id/approval')
    async updateApproval(
        @Param('id') id: string,
        @Body() updateDto: UpdateApprovalDto,
    ) {
        return this.bloodRequestsService.updateApproval(id, updateDto);
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() updateDto: UpdateStatusDto,
    ) {
        return this.bloodRequestsService.updateStatus(id, updateDto);
    }
}
