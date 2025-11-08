import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BiowasteService {
  constructor(private readonly db: DatabaseService) {}

  list() {
    return this.db.biowaste_disposal.findMany({ orderBy: { id: 'desc' } });
  }
}
