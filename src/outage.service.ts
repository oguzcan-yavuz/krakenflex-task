import { Outage, SiteInfo } from './types';

export class OutageService {
  async list(): Promise<Outage[] | undefined> {
    return [];
  }

  async getSiteInfo(name: string): Promise<SiteInfo | undefined> {
    return;
  }
}
