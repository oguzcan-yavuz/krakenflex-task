import * as nock from 'nock';
import { OUTAGE_API_BASE_URL } from '../../src/constants';
import { Outage, SiteInfo } from '../../src/types';
import { OutageService } from '../../src/outage.service';

describe('Outage Service', () => {
  let outageService: OutageService;
  let scope;
  let mockOutages: Outage[];
  let mockSiteInfo: SiteInfo;

  beforeAll(() => {
    outageService = new OutageService();
    scope = nock(OUTAGE_API_BASE_URL);
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

  // TODO: handle 500 responses
  describe('getOutages()', () => {
    it('should get all outages', async () => {
      // Arrange
      scope.get('/outages').reply(200, mockOutages);

      // Act
      const outages = await outageService.listOutages();

      // Assert
      expect(outages).toEqual(mockOutages);
      scope.isDone();
    });
  });

  describe('getSiteInfo()', () => {
    it('should get the site info for given name', async () => {
      // Arrange
      const siteId = 'kingfisher';
      scope.get(`/site-info/${siteId}`).reply(200, mockSiteInfo);

      // Act
      const siteInfo = await outageService.getSiteInfo(siteId);

      // Assert
      expect(siteInfo).toEqual(mockSiteInfo);
      scope.isDone();
    });
  });
});