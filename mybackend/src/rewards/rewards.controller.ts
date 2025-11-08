import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RewardsService } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewards: RewardsService) {}

  @Get()
  list() {
    return this.rewards.list();
  }

  @Post()
  create(@Body() body: any) {
    return this.rewards.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.rewards.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rewards.remove(+id);
  }
}
