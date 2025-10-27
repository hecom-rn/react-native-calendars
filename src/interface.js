const { TimeUtils, TimeInstance } = require('@hecom/aDate');
const {zoneConfig} = require('@hecom/aDate/config');

function padNumber(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

function xdateToData(date, isDate) {
  const dateString = date.format('YYYY-MM-DD', isDate);
  return {
    year: date.getYear(isDate),
    month: date.getMonth(isDate) + 1,
    day: date.getDate(isDate),
    timestamp: TimeUtils.create(dateString, undefined, isDate ? zoneConfig.systemZone : zoneConfig.timezone).valueOf(),
    dateString: dateString
  };
}

function parseDate(d, isDate) {
  if (!d) {
    return;
  } else if (d.timestamp) { // conventional data timestamp
    return TimeUtils.create(d.timestamp, undefined, isDate ? zoneConfig.systemZone : zoneConfig.timezone);
  } else if (d instanceof TimeInstance) { // TimeInstance
    return TimeUtils.create(d.format('YYYY-MM-DD', isDate), undefined, isDate ? zoneConfig.systemZone : zoneConfig.timezone);
  } else if (d.valueOf) { // javascript date
    const dateString = TimeUtils.create(d.valueOf()).format('YYYY-MM-DD');
    return TimeUtils.create(dateString);
  } else if (d.year) {
    const dateString = d.year + '-' + padNumber(d.month) + '-' + padNumber(d.day);
    return TimeUtils.create(dateString);
  } else if (d) { // timestamp number or date formatted as string
    return TimeUtils.create(d);
  }
}

module.exports = {
  xdateToData,
  parseDate
};
