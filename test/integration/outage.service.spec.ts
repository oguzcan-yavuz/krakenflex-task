import * as nock from 'nock';
import { OUTAGE_API_BASE_URL } from '../../src/constants';
import { Outage, SiteInfo } from '../../src/types';
import { OutageService } from '../../src/outage.service';

describe('Outage Service', () => {
  let outageService: OutageService;
  let scope;
  let mockOutages: Outage[];
  let mockSiteInfo: SiteInfo;

  beforeEach(() => {
    const apiKey = 'test';
    outageService = new OutageService(apiKey);
    scope = nock(OUTAGE_API_BASE_URL, { reqheaders: { 'x-api-key': apiKey } });
    mockOutages = [
      {
        id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
        begin: '2021-07-26T17:09:31.036Z',
        end: '2021-08-29T00:37:42.253Z',
      },
      {
        id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
        begin: '2022-05-23T12:21:27.377Z',
        end: '2022-11-13T02:16:38.905Z',
      },
      {
        id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
        begin: '2022-12-04T09:59:33.628Z',
        end: '2022-12-12T22:35:13.815Z',
      },
      {
        id: '04ccad00-eb8d-4045-8994-b569cb4b64c1',
        begin: '2022-07-12T16:31:47.254Z',
        end: '2022-10-13T04:05:10.044Z',
      },
      {
        id: '086b0d53-b311-4441-aaf3-935646f03d4d',
        begin: '2022-07-12T16:31:47.254Z',
        end: '2022-10-13T04:05:10.044Z',
      },
      {
        id: '27820d4a-1bc4-4fc1-a5f0-bcb3627e94a1',
        begin: '2021-07-12T16:31:47.254Z',
        end: '2022-10-13T04:05:10.044Z',
      },
    ];

    mockSiteInfo = {
      id: 'kingfisher',
      name: 'KingFisher',
      devices: [
        {
          id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
          name: 'Battery 1',
        },
        {
          id: '086b0d53-b311-4441-aaf3-935646f03d4d',
          name: 'Battery 2',
        },
      ],
    };
  });

  afterEach(() => {
    const pendingMocks = nock.pendingMocks();
    if (pendingMocks.length) {
      const msg = `Some nock mocks are not used: ${pendingMocks}`;
      console.error(msg);
    }
    nock.cleanAll();
  });

  describe('getOutages()', () => {
    it('should retry if 500 received', async () => {
      // Arrange
      const url = '/outages';
      scope.get(url).reply(500).get(url).reply(200);

      // Act
      await outageService.listOutages();

      // Assert
      expect(scope.isDone()).toBe(true);
    });

    it('should retry thrice if 500 received', async () => {
      // Arrange
      const url = '/outages';
      scope
        .get(url)
        .reply(500)
        .get(url)
        .reply(500)
        .get(url)
        .reply(500)
        .get(url)
        .reply(200);

      // Act
      await outageService.listOutages();

      // Assert
      expect(scope.isDone()).toBe(true);
    });

    it('should get all outages', async () => {
      // Arrange
      const url = '/outages';
      scope.get(url).reply(200, mockOutages);

      // Act
      const outages = await outageService.listOutages();

      // Assert
      expect(outages).toEqual(mockOutages);
      expect(scope.isDone()).toBe(true);
    });
  });

  describe('getSiteInfo()', () => {
    it('should retry if 500 received', async () => {
      // Arrange
      const siteId = 'kingfisher';
      const url = `/site-info/${siteId}`;
      scope.get(url).reply(500).get(url).reply(200);

      // Act
      await outageService.getSiteInfo(siteId);

      // Assert
      expect(scope.isDone()).toBe(true);
    });

    it('should retry thrice if 500 received', async () => {
      // Arrange
      const siteId = 'kingfisher';
      const url = `/site-info/${siteId}`;
      scope
        .get(url)
        .reply(500)
        .get(url)
        .reply(500)
        .get(url)
        .reply(500)
        .get(url)
        .reply(200);

      // Act
      await outageService.getSiteInfo(siteId);

      // Assert
      expect(scope.isDone()).toBe(true);
    });

    it('should get the site info for given site id', async () => {
      // Arrange
      const siteId = 'kingfisher';
      const url = `/site-info/${siteId}`;
      scope.get(url).reply(200, mockSiteInfo);

      // Act
      const siteInfo = await outageService.getSiteInfo(siteId);

      // Assert
      expect(siteInfo).toEqual(mockSiteInfo);
      expect(scope.isDone()).toBe(true);
    });
  });

  describe('createSiteOutages()', () => {
    it('should create the outages for the given site id', async () => {
      // Arrange
      const siteId = 'kingfisher';
      const mockOutagesWithDeviceNames = [
        {
          id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
          name: 'Battery 1',
          begin: '2022-05-23T12:21:27.377Z',
          end: '2022-11-13T02:16:38.905Z',
        },
        {
          id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
          name: 'Battery 1',
          begin: '2022-12-04T09:59:33.628Z',
          end: '2022-12-12T22:35:13.815Z',
        },
        {
          id: '086b0d53-b311-4441-aaf3-935646f03d4d',
          name: 'Battery 2',
          begin: '2022-07-12T16:31:47.254Z',
          end: '2022-10-13T04:05:10.044Z',
        },
      ];
      const url = `/site-outages/${siteId}`;
      scope.post(url, mockOutagesWithDeviceNames).reply(200);

      // Act
      await outageService.createSiteOutages(siteId, mockOutagesWithDeviceNames);

      // Assert
      expect(scope.isDone()).toBe(true);
    });
  });
});
