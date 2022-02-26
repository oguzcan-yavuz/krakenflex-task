import { Outage } from './types';
import { OutageService } from './outage.service';

export class Main {
  constructor(private readonly outageService: OutageService) {}

  async getOutages(): Promise<Outage[]> {
    return this.outageService.list();
  }
}
