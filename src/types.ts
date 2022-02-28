export type Outage = {
  id: string;
  begin: string;
  end: string;
};

export type Device = {
  id: string;
  name: string;
};

export type SiteInfo = {
  id: string;
  name: string;
  devices: Device[];
};

export type OutageWithDeviceName = Outage & Pick<Device, 'name'>;

export type EmptyObject = Record<string, never>;
