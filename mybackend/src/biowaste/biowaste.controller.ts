import { Controller, Get } from '@nestjs/common';
import { BiowasteService } from './biowaste.service';

@Controller('biowaste')
export class BiowasteController {
  constructor(private readonly service: BiowasteService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
