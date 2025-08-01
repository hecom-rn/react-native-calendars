const { TimeUtils, TimeInstance } = require('@hecom/aDate');

function padNumber(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

function xdateToData(date) {
  const dateString = date.format('YYYY-MM-DD');
  return {
    year: date.getYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    timestamp: TimeUtils.create(dateString).valueOf(),
    dateString: dateString
  };
}

function parseDate(d) {
  if (!d) {
    return;
  } else if (d.timestamp) { // conventional data timestamp
    return TimeUtils.create(d.timestamp);
  } else if (d instanceof TimeInstance) { // TimeInstance
    return TimeUtils.create(d.format('YYYY-MM-DD'));
  } else if (d.valueOf) { // javascript date
    const dateString = TimeUtils.create(d).format('YYYY-MM-DD');
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
