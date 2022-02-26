import { Outage, SiteInfo } from './types';
import { OutageService } from './outage.service';
import { NotFoundError } from './errors/not-found-error';

interface GetOutageOptions {
  after: Date;
}

export class Main {
  constructor(private readonly outageService: OutageService) {}

  async getOutages(options?: GetOutageOptions): Promise<Outage[]> {
    const outages = await this.outageService.list();

    if (!options) {
      return outages;
    }

    if (options.after) {
      const outagesAfterGivenDate = outages.filter(
        (outage) => new Date(outage.begin) > options.after,
      );

      return outagesAfterGivenDate;
    }
  }

  async getSiteInfo(name: string): Promise<SiteInfo> {
    const siteInfo = await this.outageService.getSiteInfo(name);

    if (siteInfo === undefined) {
      throw new NotFoundError();
    }

    return siteInfo;
  }
}
