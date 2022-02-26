import { Outage, OutageWithDeviceNames, SiteInfo } from './types';
import axios, { AxiosInstance } from 'axios';
import { OUTAGE_API_BASE_URL } from './constants';

export class OutageService {
  private httpClient: AxiosInstance;
  constructor() {
    this.httpClient = axios.create({
      baseURL: OUTAGE_API_BASE_URL,
      timeout: 1000,
      // headers: {'X-Custom-Header': 'foobar'} // TODO: add the api-key here
    });
  }

  async listOutages(): Promise<Outage[] | undefined> {
    const url = '/outages';
    const { data: outages } = await this.httpClient.get<Outage[]>(url);

    return outages;
  }

  async getSiteInfo(siteId: string): Promise<SiteInfo | undefined> {
    const url = `/site-info/${siteId}`;
    const { data: siteInfo } = await this.httpClient.get<SiteInfo>(url);

    return siteInfo;
  }

  async createSiteOutages(
    siteId: string,
    outages: OutageWithDeviceNames[],
  ): Promise<void> {
    return;
  }
}
