#!/usr/bin/env node
import 'dotenv/config';
import { Command, InvalidArgumentError } from 'commander';
import { isISO8601 } from 'validator';
import { Main } from '../src/main';
import { OutageService } from '../src/outage.service';

type Input = {
  apiKey: string;
  siteId: string;
  dateAfter: Date;
};

const parseDate = (value: string): Date => {
  const isValid = isISO8601(value);
  if (!isValid) {
    throw new InvalidArgumentError('Date must be provided in ISO-8601 format.');
  }
  const date = new Date(value);

  return date;
};

(async () => {
  try {
    const program = new Command();
    const defaultApiKey = process.env.OUTAGE_API_KEY;
    const defaultSiteId = 'norwich-pear-tree';
    const defaultDate = new Date('2022-01-01T00:00:00.000Z');

    program.name('create-outages').version('1.0.0');
    program
      .option(
        '-a, --api-key <key>',
        'api key for the outage service',
        defaultApiKey,
      )
      .option('-s, --site-id <siteId>', 'site id to add outages', defaultSiteId)
      .option<Date>(
        '-d, --date-after <date>',
        'starting date of the outages in ISO-8601 format',
        parseDate,
        defaultDate,
      );

    program.parse();

    const { apiKey, siteId, dateAfter } = program.opts<Input>();

    const outageService = new OutageService(apiKey);
    const main = new Main(outageService);

    await main.run(siteId, dateAfter);
    console.log('Outages created successfully!');
  } catch (err) {
    console.error(err);
  }
})();
