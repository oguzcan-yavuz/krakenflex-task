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
      const isAfter = after ? new Date(outage.begin) >= after : true;
      const isOutageOfGivenDevices =
        deviceIdSet.size > 0 ? deviceIdSet.has(outage.id) : true;

      return isAfter && isOutageOfGivenDevices;
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

    if (siteInfo === undefined || Object.keys(siteInfo).length === 0) {
      throw new NotFoundError();
    }

    return siteInfo as SiteInfo;
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
