const { TimeUtils, TimeInstance } = require('@hecom/aDate');
const {zoneConfig} = require('@hecom/aDate/config');

let _formatDateCallback = null;

/**
 * 设置全局时间格式化回调，用于适配多地区显示。
 * @param {(timestamp: number, dateType: 'Date' | 'Time' | 'Month' | 'Year' | '') => string} fn
 */
function setFormatDateCallback(fn) {
  _formatDateCallback = fn;
}

/**
 * 格式化日期用于显示。有回调时优先使用回调，否则使用 fallbackFormat。
 * @param {TimeInstance} date
 * @param {'Date' | 'Time' | 'Month' | 'Year' | ''} dateType
 * @param {string} fallbackFormat
 * @returns {string}
 */
function formatDate(date, dateType, fallbackFormat) {
  if (_formatDateCallback) {
    return _formatDateCallback(date.valueOf(), dateType);
  }
  return date.format(fallbackFormat);
}

function padNumber(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

function xdateToData(date, isDate) {
  const dateString = date.format('YYYY-MM-DD');
  return {
    year: date.getYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    timestamp: date.valueOf(isDate),
    dateString: dateString
  };
}

function parseDate(d) {
  if (!d) {
    return;
  } else if (d.timestamp) { // conventional data timestamp
    return TimeUtils.create(d.timestamp);
  } else if (d instanceof TimeInstance) { // TimeInstance
    return d;
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
  parseDate,
  setFormatDateCallback,
  formatDate,
};
