const iface = require('./interface');
const { TimeUtils } = require('@hecom/aDate');

describe('calendar interface', () => {
  describe('input', () => {
    it('should return undefined if date is undefined', () => {
      const date = iface.parseDate();
      expect(date).toBe(undefined);
    });

    it('should accept UTC timestamp as argument', () => {
      const date = iface.parseDate(1479832134398);
      expect(date.valueOf()).toEqual(1479832134398);
    });

    it('should accept datestring as argument', () => {
      const date = iface.parseDate('2012-03-16');
      expect(date.format('YYYY-MM-DD')).toEqual('2012-03-16');
    });

    it('should expect object with UTC timestamp as argument', () => {
      const date = iface.parseDate({timestamp: 1479832134398});
      expect(date.valueOf()).toEqual(1479832134398);
    });

    it('should accept XDate as argument', () => {
      const testDate = TimeUtils.create('2016-11-22 00:00:00+03:00');
      expect(testDate.toISOString()).toEqual('2016-11-21T21:00:00.000Z');
      const time = 1479772800000;
      expect(TimeUtils.create(time).toISOString()).toEqual('2016-11-22T00:00:00.000Z');
    });

    it('should accept Date as argument', () => {
      const testDate = TimeUtils.create('2015-06-05 12:00:00');
      const date = iface.parseDate(testDate);
      expect(date.format('YYYY-MM-DD')).toEqual('2015-06-05');
    });

    it('should accept data as argument', () => {
      const testDate = {
        year: 2015,
        month: 5,
        day: 6
      };
      const date = iface.parseDate(testDate);
      expect(date.format('YYYY-MM-DD')).toEqual('2015-05-06');
    });
  });

  describe('output', () => {
    it('should convert xdate to data', () => {
      const time = 1479772800000;
      const testDate = TimeUtils.create(time);
      expect(testDate.toISOString()).toEqual('2016-11-22T00:00:00.000Z');
      const data = iface.xdateToData(testDate);
      expect(data).toEqual({
        year: 2016,
        month: 11,
        day: 22,
        timestamp: 1479772800000,
        dateString: '2016-11-22'
      });
    });
  });
});
