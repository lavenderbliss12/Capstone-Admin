import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly db: DatabaseService) {}

  list() {
    return this.db.transaction.findMany({ orderBy: { reference_id: 'desc' } });
  }

  async create(data: { user_id: number; reward_name: string; points_used: number }) {
    // basic points check then create
    const user = await this.db.user.findUnique({ where: { id: data.user_id } });
    if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    if ((user.points ?? 0) < data.points_used) throw new HttpException('Insufficient points', HttpStatus.BAD_REQUEST);

    await this.db.user.update({ where: { id: data.user_id }, data: { points: (user.points ?? 0) - data.points_used } });
    return this.db.transaction.create({ data: { user_id: data.user_id, reward_name: data.reward_name, points_used: data.points_used } });
  }
}
