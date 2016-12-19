import mongoose from 'mongoose';
import * as _ from 'lodash';
import {
  shimmy,
  getRandomInt,
  d30,
  generateStorm,
  assignTime,
  trackStorm } from '../../lib/generators';
import { ZONE_VARIANCE, STORM_TYPE_TABLE } from '../../config/constants/weather.constants';

const logger = require('../../lib/logger')();

const Generator = mongoose.model('Generator');

/*
 * @TODO: there is a lot happening here... can it be simplified further? tested at all?
 * cause at the moment it is buggy!
 */
export function generateWeather(req, res) {
  const { zone, terrain, season, month, initialMs } = req.body;

  Generator
  .find({ name: 'weather' })
  .lean()
  .exec((err, gen) => {
    if (!err) {
      logger.log(`generateWeather: ${gen[0].name}`);

      const { generator } = gen[0];
      const { temp: baseTemp } = generator[zone][terrain][season][month];
      const { high: seasonalHigh } = generator[zone].seasonalVariance[season];
      const { low: seasonalLow } = generator[zone].seasonalVariance[season];
      const { weatherClass } = generator[zone][terrain][season][month];
      logger.log('generateWeather: weatherClass %s', weatherClass);

      const mean = baseTemp + getRandomInt(0, _.sample(ZONE_VARIANCE));
      const high = mean + getRandomInt(0, seasonalHigh);
      const low = mean + getRandomInt(0, seasonalLow);

      const temps = [];
      // create an array of temps within our range of high and low
      for (let i = 0; i < 24; i += 1) {
        temps.push({ temp: getRandomInt(low, high) });
      }

      let stormType = 'none';
      if (weatherClass) {
        const roll = d30();
        logger.log('stormType: weatherClass: %s', weatherClass);
        logger.log('stormType: roll: %s', roll);
        stormType = STORM_TYPE_TABLE[weatherClass][roll];
        logger.log('stormType: %s', stormType);
      }

      // reverse order temps and shimmy into an ordered set of observed temps by hour of the day
      const observedTempsByHour = assignTime(
        shimmy(_.chain(temps).orderBy('temp').reverse().value()),
        initialMs
      );

      // if storm track and map to observedTempsByHour
      // otherwise just return observedTempsByHour
      let observed = observedTempsByHour;
      logger.log('stormType: %s', stormType);
      if (stormType !== 'none') {
        observed = trackStorm(observedTempsByHour, generateStorm(stormType));
      }

      const currentWeather = {
        temp: {
          forecast: {
            low,
            high,
            stormType,
          },
          observed,
        },
      };

      return res.send(currentWeather);
    }
    logger.log('generateWeather Error: %j', err);
    return res.send(err);
  });
}
