import { Outage, SiteInfo } from './types';
import { OutageService } from './outage.service';
import { NotFoundError } from './errors/not-found-error';

export class Main {
  constructor(private readonly outageService: OutageService) {}

  async getOutages(): Promise<Outage[]> {
    return this.outageService.list();
  }

  async getSiteInfo(name: string): Promise<SiteInfo> {
    const siteInfo = await this.outageService.getSiteInfo(name);

    if (siteInfo === undefined) {
      throw new NotFoundError();
    }

    return siteInfo;
  }
}
