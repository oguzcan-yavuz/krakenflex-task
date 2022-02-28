import { Main } from '../../src/main';
import { Outage, SiteInfo } from '../../src/types';
import { instance, mock, reset, when, verify, deepEqual } from 'ts-mockito';
import { OutageService } from '../../src/outage.service';
import { NotFoundError } from '../../src/errors/not-found-error';

describe('main', () => {
  let main: Main;
  let mockOutageService: OutageService;
  let mockOutages: Outage[];
  let mockSiteInfo: SiteInfo;

  beforeAll(() => {
    mockOutageService = mock(OutageService);
    main = new Main(instance(mockOutageService));
  });

  beforeEach(() => {
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
    reset(mockOutageService);
  });

  describe('getOutages()', () => {
    it('should throw not found if there are no outages', async () => {
      // Arrange
      when(mockOutageService.listOutages()).thenResolve(undefined);

      // Act
      const fn = () => main.getOutages();

      // Assert
      await expect(fn).rejects.toThrow(NotFoundError);
    });

    it('should throw not found if outage service returns empty array', async () => {
      // Arrange
      when(mockOutageService.listOutages()).thenResolve([]);

      // Act
      const fn = () => main.getOutages();

      // Assert
      await expect(fn).rejects.toThrow(NotFoundError);
    });

    it('should get the list of outages', async () => {
      // Arrange
      when(mockOutageService.listOutages()).thenResolve(mockOutages);

      // Act
      const outages = await main.getOutages();

      // Assert
      expect(outages).toEqual(mockOutages);
      verify(mockOutageService.listOutages()).once();
    });
  });

  describe('getSiteInfo()', () => {
    it('should throw not found if outage service returns undefined', async () => {
      // Arrange
      const siteId = 'empty-site';
      when(mockOutageService.getSiteInfo(siteId)).thenResolve(undefined);

      // Act
      const fn = () => main.getSiteInfo(siteId);

      // Assert
      await expect(fn).rejects.toThrow(NotFoundError);
    });

    it('should throw not found if outage service returns empty object', async () => {
      // Arrange
      const siteId = 'empty-site';
      when(mockOutageService.getSiteInfo(siteId)).thenResolve({});

      // Act
      const fn = () => main.getSiteInfo(siteId);

      // Assert
      await expect(fn).rejects.toThrow(NotFoundError);
    });

    it('should retrieve site information for the given site id', async () => {
      // Arrange
      const siteId = 'kingfisher';
      when(mockOutageService.getSiteInfo(siteId)).thenResolve(mockSiteInfo);

      // Act
      const siteInfo = await main.getSiteInfo(siteId);

      // Assert
      expect(siteInfo).toEqual(mockSiteInfo);
      verify(mockOutageService.getSiteInfo(siteId)).once();
    });
  });

  describe('filterOutages()', () => {
    it('should filter out the outages started before the given date', async () => {
      // Arrange
      const startDate = '2022-01-01T00:00:00.000Z';
      const endDate = '2022-01-01T02:00:00.000Z';
      // it should also include the given date
      mockOutages[0].begin = startDate;
      mockOutages[0].end = endDate;
      const after = new Date(startDate);
      const outagesAfterGivenDate = [
        // mutated outage
        {
          id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
          begin: startDate,
          end: endDate,
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
      ];

      // Act
      const outages = main.filterOutages({ after }, mockOutages);

      // Assert
      expect(outages).toEqual(expect.arrayContaining(outagesAfterGivenDate));
    });

    it('should filter out the outages that dont belong to given devices', () => {
      // Arrange
      const devices = [
        {
          id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
          name: 'Battery 1',
        },
        {
          id: '086b0d53-b311-4441-aaf3-935646f03d4d',
          name: 'Battery 2',
        },
      ];
      const outagesWithDeviceIds = [
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
          id: '086b0d53-b311-4441-aaf3-935646f03d4d',
          begin: '2022-07-12T16:31:47.254Z',
          end: '2022-10-13T04:05:10.044Z',
        },
      ];

      // Act
      const outages = main.filterOutages({ devices }, mockOutages);

      // Assert
      expect(outages).toEqual(expect.arrayContaining(outagesWithDeviceIds));
    });

    it('should filter out both outages before given date and the outages without the given devices', () => {
      // Arrange
      const after = new Date('2022-01-01T00:00:00.000Z');
      const devices = [
        {
          id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
          name: 'Battery 1',
        },
        {
          id: '086b0d53-b311-4441-aaf3-935646f03d4d',
          name: 'Battery 2',
        },
      ];
      const outagesAfterGivenDateAndWithDeviceIds = [
        {
          id: '086b0d53-b311-4441-aaf3-935646f03d4d',
          begin: '2022-07-12T16:31:47.254Z',
          end: '2022-10-13T04:05:10.044Z',
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
      ];

      // Act
      const outages = main.filterOutages({ after, devices }, mockOutages);

      // Assert
      expect(outages).toEqual(
        expect.arrayContaining(outagesAfterGivenDateAndWithDeviceIds),
      );
    });
  });

  describe('attachDeviceNamesToOutages()', () => {
    it('should attach device names to the corresponding outages', () => {
      // Arrange
      const outages = [
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
          id: '086b0d53-b311-4441-aaf3-935646f03d4d',
          begin: '2022-07-12T16:31:47.254Z',
          end: '2022-10-13T04:05:10.044Z',
        },
      ];
      const devices = [
        {
          id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
          name: 'Battery 1',
        },
        {
          id: '086b0d53-b311-4441-aaf3-935646f03d4d',
          name: 'Battery 2',
        },
      ];
      const expectedOutagesWithDeviceNames = [
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

      // Act
      const outagesWithDeviceNames = main.attachDeviceNameToOutages(
        devices,
        outages,
      );

      // Assert
      expect(outagesWithDeviceNames).toEqual(
        expect.arrayContaining(expectedOutagesWithDeviceNames),
      );
    });
  });

  describe('run()', () => {
    it('should compose all functions correctly', async () => {
      // Arrange
      const siteId = 'kingfisher';
      const after = new Date('2022-01-01T00:00:00.000Z');
      when(mockOutageService.listOutages()).thenResolve(mockOutages);
      when(mockOutageService.getSiteInfo(siteId)).thenResolve(mockSiteInfo);
      const filterSpy = jest.spyOn(main, 'filterOutages');
      const attachNamesSpy = jest.spyOn(main, 'attachDeviceNameToOutages');
      const siteOutages = [
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

      // Act
      await main.run(siteId, after);

      // Assert
      verify(mockOutageService.listOutages()).once();
      verify(mockOutageService.getSiteInfo(siteId)).once();
      expect(filterSpy).toHaveBeenCalledTimes(1);
      expect(attachNamesSpy).toHaveBeenCalledTimes(1);
      verify(
        mockOutageService.createSiteOutages(siteId, deepEqual(siteOutages)),
      ).once();
    });
  });
});
