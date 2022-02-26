#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { Main } from '../src/main';
import { OutageService } from '../src/outage.service';

type Input = {
  apiKey: string;
  siteId: string;
  dateAfter: string;
};

const program = new Command();

program.name('create-outages').version('1.0.0');
program
  .option(
    '-a, --api-key <key>',
    'api key for the outage service',
    process.env.OUTAGE_API_KEY,
  )
  .option(
    '-s, --site-id <siteId>',
    'site id to add outages',
    'norwich-pear-tree',
  )
  .option(
    '-d, --date-after <date>',
    'beginning date of the outages',
    '2022-01-01T00:00:00.000Z',
  );

program.parse();

const { apiKey, siteId, dateAfter } = program.opts<Input>();

const date = new Date(dateAfter);
const outageService = new OutageService(apiKey);
const main = new Main(outageService);

(async () => {
  try {
    await main.run(siteId, date);
    console.log('Outages created successfully!');
  } catch (err) {
    console.error(err);
  }
})();
