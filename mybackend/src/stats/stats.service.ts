import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class StatsService {
  constructor(private readonly db: DatabaseService) {}

  async getStats() {
    const userCount = await this.db.user.count();
    // weekly disposal stub (would group by date in real implementation)
    const disposalKgWeek = [
      { day: 'M', waste: 0 },
      { day: 'T', waste: 0 },
      { day: 'W', waste: 0 },
      { day: 'T', waste: 0 },
      { day: 'F', waste: 0 },
      { day: 'S', waste: 0 },
      { day: 'S', waste: 0 },
    ];
    return {
      userCount,
      totalPoints: 0,
      disposalKgWeek,
      wasteStatus: { fullPercent: 0 }
    };
  }
}
