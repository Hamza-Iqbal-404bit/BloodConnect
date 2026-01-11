import { Controller, Get, Post, Body } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto';

@Controller('donations')
export class DonationsController {
    constructor(private donationsService: DonationsService) { }

    @Get()
    async findAll() {
        return this.donationsService.findAll();
    }

    @Post()
    async create(@Body() createDto: CreateDonationDto) {
        return this.donationsService.create(createDto);
    }
}
