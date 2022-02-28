import { EmptyObject, Outage, OutageWithDeviceName, SiteInfo } from './types';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { OUTAGE_API_BASE_URL } from './constants';

export class OutageService {
  private httpClient: AxiosInstance;

  constructor(apiKey: string) {
    const axiosInstance = axios.create({
      baseURL: OUTAGE_API_BASE_URL,
      timeout: 5000,
      headers: { 'x-api-key': apiKey },
    });
    axiosRetry(axiosInstance, { retries: 3 });

    this.httpClient = axiosInstance;
  }

  async listOutages(): Promise<Outage[] | undefined> {
    const url = '/outages';
    const { data: outages } = await this.httpClient.get<Outage[]>(url);

    return outages;
  }

  async getSiteInfo(
    siteId: string,
  ): Promise<SiteInfo | EmptyObject | undefined> {
    const url = `/site-info/${siteId}`;
    const { data: siteInfo } = await this.httpClient.get<
      SiteInfo | EmptyObject
    >(url);

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
