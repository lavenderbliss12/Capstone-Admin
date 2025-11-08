import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RewardsService {
  constructor(private readonly db: DatabaseService) {}

  list() {
    return this.db.reward.findMany({ orderBy: { id: 'desc' } });
  }

  create(data: { name: string; points_required: number; stock?: number; available?: boolean; thumbnail?: string | null }) {
    return this.db.reward.create({ data });
  }

  update(id: number, data: Partial<{ name: string; points_required: number; stock: number; available: boolean; thumbnail?: string | null }>) {
    return this.db.reward.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.db.reward.delete({ where: { id } });
  }
}
