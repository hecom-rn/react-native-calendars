const { TimeUtils, TimeInstance } = require('@hecom/aDate');

function sameMonth(a, b) {
  return a instanceof TimeInstance && b instanceof TimeInstance &&
    a.getYear() === b.getYear() &&
    a.getMonth() === b.getMonth();
}

function sameDate(a, b) {
  return a instanceof TimeInstance && b instanceof TimeInstance &&
    a.getYear() === b.getYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isGTE(a, b) {
  return b.diff(a, 'day') > -1;
}

function isLTE(a, b) {
  return a.diff(b, 'day') > -1;
}

function fromTo(a, b) {
  const days = [];
  let from = a.valueOf(), to = b.valueOf();
  for (; from <= to; from = TimeUtils.create(from).add(1, 'day').valueOf()) {
    days.push(TimeUtils.create(from));
  }
  return days;
}

function month(xd) {
  const year = xd.getYear();
  const month = xd.getMonth();
  const days = TimeUtils.create().year(year).month(month + 1).date(0).getDate();

  const firstDay = TimeUtils.create().year(year).month(month).date(1).startOfDay();
  const lastDay = TimeUtils.create().year(year).month(month).date(days).startOfDay();

  return fromTo(firstDay, lastDay);
}

function weekDayNames(firstDayOfWeek = 0) {
  const weekdaysMin = TimeUtils.weekdaysMin();
  let weekDaysNames = weekdaysMin;
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    weekDaysNames = weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

function week(xd, firstDayOfWeek) {
  const fdow = ((7 + firstDayOfWeek) % 7) || 7;
  const ldow = (fdow + 6) % 7;

  let from = xd.clone();
  if (from.getDay() !== fdow) {
    const daysDiff = -(from.getDay() + 7 - fdow) % 7;
    from = from.add(daysDiff, 'day');
  }

  let to = xd.clone();
  const day = to.getDay();
  if (day !== ldow) {
    const daysDiff = (ldow + 7 - day) % 7;
    to = to.add(daysDiff, 'day');
  }
  return fromTo(from, to);
}

function page(xd, firstDayOfWeek) {
  const days = month(xd);
  let before = [], after = [];

  const fdow = ((7 + firstDayOfWeek) % 7) || 7;
  const ldow = (fdow + 6) % 7;

  firstDayOfWeek = firstDayOfWeek || 0;

  let from = days[0].clone();
  if (from.getDay() !== fdow) {
    const daysDiff = -(from.getDay() + 7 - fdow) % 7;
    from = from.add(daysDiff, 'day');
  }

  let to = days[days.length - 1].clone();
  const day = to.getDay();
  if (day !== ldow) {
    const daysDiff = (ldow + 7 - day) % 7;
    to = to.add(daysDiff, 'day');
  }

  if (isLTE(from, days[0])) {
    before = fromTo(from, days[0]);
  }

  if (isGTE(to, days[days.length - 1])) {
    after = fromTo(days[days.length - 1], to);
  }

  return before.concat(days.slice(1, days.length - 1), after);
}

module.exports = {
  weekDayNames,
  sameMonth,
  sameDate,
  month,
  week,
  page,
  fromTo,
  isLTE,
  isGTE
};
