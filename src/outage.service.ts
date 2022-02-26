import { Outage, OutageWithDeviceNames, SiteInfo } from './types';

export class OutageService {
  async list(): Promise<Outage[] | undefined> {
    return [];
  }

  async getSiteInfo(siteName: string): Promise<SiteInfo | undefined> {
    return;
  }

  async createSiteOutages(
    siteName: string,
    outages: OutageWithDeviceNames[],
  ): Promise<void> {
    return;
  }
}
