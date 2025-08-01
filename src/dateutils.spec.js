const { TimeUtils } = require('@hecom/aDate');
const dateutils = require('./dateutils');

describe('dateutils', function () {
  describe('sameMonth()', function () {
    it('2014-01-01 === 2014-01-10', function () {
      const a = TimeUtils.create('2014-01-01');
      const b = TimeUtils.create('2014-01-10');
      expect(dateutils.sameMonth(a, b)).toEqual(true);
    });
    it('for non-TimeUtils instances is false', function () {
      expect(dateutils.sameMonth('a', 'b')).toEqual(false);
      expect(dateutils.sameMonth(123, 345)).toEqual(false);
      expect(dateutils.sameMonth(null, false)).toEqual(false);

      const a = TimeUtils.create('2014-01-01');
      const b = TimeUtils.create('2014-01-10');
      expect(dateutils.sameMonth(a, undefined)).toEqual(false);
      expect(dateutils.sameMonth(null, b)).toEqual(false);
    });
  });

  describe('isLTE()', function () {
    it('2014-01-20 >= 2013-12-31', function () {
      const a = TimeUtils.create('2013-12-31');
      const b = TimeUtils.create('2014-01-20');
      expect(dateutils.isLTE(a, b)).toBe(true);
    });

    it('2014-10-20 >= 2014-10-19', function () {
      const a = TimeUtils.create('2014-10-19');
      const b = TimeUtils.create('2014-10-20');
      expect(dateutils.isLTE(a, b)).toBe(true);
    });

    it('2014-10-20 >= 2014-09-30', function () {
      const a = TimeUtils.create('2014-09-30');
      const b = TimeUtils.create('2014-10-20');
      expect(dateutils.isLTE(a, b)).toBe(true);
    });

    it('works for dates that differ by less than a day', function () {
      const a = TimeUtils.create('2014-09-30 00:01:00');
      const b = TimeUtils.create('2014-09-30 01:00:01');
      expect(dateutils.isLTE(a, b)).toBe(true);
      expect(dateutils.isLTE(b, a)).toBe(true);
    });
  });

  describe('isGTE()', function () {
    it('2014-01-20 >= 2013-12-31', function () {
      const a = TimeUtils.create('2013-12-31');
      const b = TimeUtils.create('2014-01-20');
      expect(dateutils.isGTE(b, a)).toBe(true);
    });

    it('2014-10-20 >= 2014-10-19', function () {
      const a = TimeUtils.create('2014-10-19');
      const b = TimeUtils.create('2014-10-20');
      expect(dateutils.isGTE(b, a)).toBe(true);
    });

    it('2014-10-20 >= 2014-09-30', function () {
      const a = TimeUtils.create('2014-09-30');
      const b = TimeUtils.create('2014-10-20');
      expect(dateutils.isGTE(b, a)).toBe(true);
    });

    it('works for dates that differ by less than a day', function () {
      const a = TimeUtils.create('2014-09-30 00:01:00');
      const b = TimeUtils.create('2014-09-30 01:00:01');
      expect(dateutils.isGTE(a, b)).toBe(true);
      expect(dateutils.isGTE(b, a)).toBe(true);
    });
  });

  describe('month()', function () {
    it('2014 May', function () {
      const days = dateutils.month(TimeUtils.create('2014-05-01'));
      expect(days.length).toBe(31);
    });

    it('2014 August', function () {
      const days = dateutils.month(TimeUtils.create('2014-08-01'));
      expect(days.length).toBe(31);
    });
  });

  describe('page()', function () {
    it('2014 March', function () {
      const days = dateutils.page(TimeUtils.create('2014-03-23'));
      expect(days.length).toBe(42);
      expect(days[0].format())
        .toBe(TimeUtils.create('2014-02-23').format());
      expect(days[days.length - 1].format())
        .toBe(TimeUtils.create('2014-04-05').format());
    });

    it('2014 May', function () {
      const days = dateutils.page(TimeUtils.create('2014-05-23'));
      expect(days.length).toBe(35);
    });

    it('2014 June', function () {
      const days = dateutils.page(TimeUtils.create('2014-06-23'));
      expect(days.length).toBe(35);
    });

    it('2014 August', function () {
      const days = dateutils.page(TimeUtils.create('2014-08-23'));
      expect(days.length).toBe(42);
    });

    it('2014 October', function () {
      const days = dateutils.page(TimeUtils.create('2014-10-21'));
      expect(days.length).toBe(35);
    });

    it('has all days in ascending order', function () {
      let days, i, len;

      days = dateutils.page(TimeUtils.create('2014-03-01'));
      for (i = 0, len = days.length - 1; i < len; i++) {
        expect(days[i].diffDays(days[i + 1])).toBe(1);
      }
      days = dateutils.page(TimeUtils.create('2014-10-01'));
      for (i = 0, len = days.length - 1; i < len; i++) {
        expect(days[i].diffDays(days[i + 1])).toBe(1);
      }
    });
  });

});
