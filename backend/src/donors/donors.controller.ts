import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    ConflictException,
} from '@nestjs/common';
import { DonorsService } from './donors.service';
import { CreateDonorDto, UpdateApprovalDto } from './dto';
import { BloodRequestsService } from '../blood-requests/blood-requests.service';

@Controller('donors')
export class DonorsController {
    constructor(
        private donorsService: DonorsService,
        private bloodRequestsService: BloodRequestsService,
    ) { }

    @Get()
    async findAll() {
        return this.donorsService.findAll();
    }

    @Get('matching/:requestId')
    async findMatching(@Param('requestId') requestId: string) {
        const request = await this.bloodRequestsService.findById(requestId);
        return this.donorsService.findMatching(
            request.bloodGroup,
            request.city?.name,
        );
    }

    @Post()
    async create(@Body() createDonorDto: CreateDonorDto) {
        // Check if email already exists
        const existing = await this.donorsService.findByEmail(createDonorDto.email);
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        return this.donorsService.create(createDonorDto);
    }

    @Patch(':id/approval')
    async updateApproval(
        @Param('id') id: string,
        @Body() updateApprovalDto: UpdateApprovalDto,
    ) {
        return this.donorsService.updateApproval(id, updateApprovalDto);
    }
}
