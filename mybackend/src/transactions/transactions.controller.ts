import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post()
  create(@Body() body: { user_id: number; reward_name: string; points_used: number }) {
    return this.service.create(body);
  }
}
