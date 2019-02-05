# edf-api

> EDF API client reverse engineered for javascript

[![NPM](https://img.shields.io/npm/v/@dallegoet/edf-api.svg)](https://www.npmjs.com/package/@dallegoet/edf-api) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add "@dallegoet/edf-api"
```

## Usage

```js
import { Client } from '@dallegoet/edf-api';
import moment from 'moment';

const client = new Client('email', 'password'); // from edf.fr

const begin = moment().startOf('month');
const end = moment();

client.getDailyElectricConsumptions(begin, end).then(console.log);

// output
{ dailyElecEnergies:
   [ { consumption: [Object],
       day: '2019-02-02',
       standingCharge: 0.368,
       totalCost: 2.8453,
       qualityIndicator: 1,
       consumptionStatus: 'normal' } ],
  monthlyElecEnergies:
   [ { month: '2019-02',
       beginDay: '2019-02-01',
       endDay: '2019-02-05',
       standingCharge: 0.368,
       totalCost: 2.8453,
       consumption: [Object] } ] }
```

## License

MIT © [dallegoet](https://github.com/dallegoet)
