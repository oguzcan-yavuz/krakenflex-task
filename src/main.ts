import { Device, Outage, OutageWithDeviceName, SiteInfo } from './types';
import { OutageService } from './outage.service';
import { NotFoundError } from './errors/not-found-error';

type FilterOutageOptions = {
  after?: Date;
  devices?: Device[];
};

export class Main {
  constructor(private readonly outageService: OutageService) {}

  attachDeviceNameToOutages(
    devices: Device[],
    outages: Outage[],
  ): OutageWithDeviceName[] {
    const deviceIdToName = devices.reduce((map, device) => {
      map.set(device.id, device.name);
      return map;
    }, new Map<string, string>());

    const outageWithDeviceNames = outages.map((outage) => {
      const deviceName = deviceIdToName.get(outage.id);

      return { ...outage, name: deviceName };
    });

    return outageWithDeviceNames;
  }

  filterOutages(options: FilterOutageOptions, outages: Outage[]): Outage[] {
    const { after, devices = [] } = options;
    const deviceIdSet = new Set(devices.map((device) => device.id));

    const filteredOutages = outages.filter((outage) => {
      let condition = true;
      if (after) {
        condition &&= new Date(outage.begin) >= after;
      }
      if (devices.length > 0) {
        condition &&= deviceIdSet.has(outage.id);
      }

      return condition;
    });

    return filteredOutages;
  }

  async getOutages(): Promise<Outage[]> {
    const outages = await this.outageService.listOutages();

    if (outages === undefined || outages.length === 0) {
      throw new NotFoundError();
    }

    return outages;
  }

  async getSiteInfo(siteId: string): Promise<SiteInfo> {
    const siteInfo = await this.outageService.getSiteInfo(siteId);

    if (siteInfo === undefined) {
      throw new NotFoundError();
    }

    return siteInfo;
  }

  async run(siteId: string, after: Date): Promise<void> {
    const [outages, { devices }] = await Promise.all([
      this.getOutages(),
      this.getSiteInfo(siteId),
    ]);
    const filterOptions = { after, devices };
    const filteredOutages = this.filterOutages(filterOptions, outages);
    const outagesWithDeviceNames = this.attachDeviceNameToOutages(
      devices,
      filteredOutages,
    );
    await this.outageService.createSiteOutages(siteId, outagesWithDeviceNames);
  }
}
