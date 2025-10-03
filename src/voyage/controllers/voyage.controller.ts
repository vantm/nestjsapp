import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateVoyageDto } from '@app/voyage/dto/create-voyage.dto';
import { UpdateVoyageDto } from '@app/voyage/dto/update-voyage.dto';
import { VoyageService } from '@app/voyage/services/voyage.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('voyage')
export class VoyageController {
  constructor(private readonly voyageService: VoyageService) {}

  @Post()
  create(@Body() createVoyageDto: CreateVoyageDto) {
    return this.voyageService.create(createVoyageDto);
  }

  @Post(':id/onboarding')
  onboard(@Param('id') id: string) {
    return this.voyageService.startOnboarding(+id);
  }

  @Get()
  findAll() {
    return this.voyageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voyageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoyageDto: UpdateVoyageDto) {
    return this.voyageService.update(+id, updateVoyageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voyageService.remove(+id);
  }
}
