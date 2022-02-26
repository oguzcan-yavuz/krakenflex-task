import { Outage, OutageWithDeviceName, SiteInfo } from './types';
import axios, { AxiosInstance } from 'axios';
import { OUTAGE_API_BASE_URL } from './constants';

export class OutageService {
  private httpClient: AxiosInstance;
  constructor(apiKey: string) {
    this.httpClient = axios.create({
      baseURL: OUTAGE_API_BASE_URL,
      timeout: 5000,
      headers: { 'x-api-key': apiKey },
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
    outages: OutageWithDeviceName[],
  ): Promise<void> {
    const url = `/site-outages/${siteId}`;
    await this.httpClient.post(url, outages);
  }
}
