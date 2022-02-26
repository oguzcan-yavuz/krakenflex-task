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

  async list(): Promise<Outage[] | undefined> {
    const { data: outages } = await this.httpClient.get('/outages');

    return outages;
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
