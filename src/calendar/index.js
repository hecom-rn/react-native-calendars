import React, {Component} from 'react';
import {
    View,
    LayoutAnimation,
    PanResponder,
    InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';
import { TimeUtils } from '@hecom/aDate';

import dateutils from '../dateutils';
import {xdateToData, parseDate} from '../interface';
import styleConstructor from './style';
import Day from './day/basic';
import UnitDay from './day/period';
import MultiDotDay from './day/multi-dot';
import CalendarHeader from './header';
import shouldComponentUpdate from './updater';
import {zoneConfig} from '@hecom/aDate/config';

const DeprecatedPropTypes = require('deprecated-react-native-prop-types');
//Fallback when RN version is < 0.44
const viewPropTypes = DeprecatedPropTypes.ViewPropTypes || View.propTypes;
const MODE = {WEEK:1,MONTH:0};
const EmptyArray = [];

class Calendar extends Component {
  static propTypes = {
        // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
        // Collection of dates that have to be marked. Default = {}
    markedDates: PropTypes.object,

        // Specify style for calendar container element. Default = {}
    style: viewPropTypes.style,
        // Initially visible month. Default = Date()
    current: PropTypes.any,
        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
    minDate: PropTypes.any,
        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
    maxDate: PropTypes.any,

        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
    firstDay: PropTypes.number,

        // Date marking style [simple/period]. Default = 'simple'
    markingType: PropTypes.string,

        // Hide month navigation arrows. Default = false
    hideArrows: PropTypes.bool,
        // Display loading indicador. Default = false
    displayLoadingIndicator: PropTypes.bool,
        // Do not show days of other months in month page. Default = false
    hideExtraDays: PropTypes.bool,

        // Handler which gets executed on day press. Default = undefined
    onDayPress: PropTypes.func,
        // Handler which gets executed when visible month changes in calendar. Default = undefined
    onMonthChange: PropTypes.func,
    onVisibleMonthsChange: PropTypes.func,
        // Replace default arrows with custom ones (direction can be 'left' or 'right')
    renderArrow: PropTypes.func,
        // Provide custom day rendering component
    dayComponent: PropTypes.any,
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
    monthFormat: PropTypes.string,
        // Disables changing month when click on days of other months (when hideExtraDays is false). Default = false
    disableMonthChange: PropTypes.bool,
        //  Hide day names. Default = false
    hideDayNames: PropTypes.bool,
        // Disable days by default. Default = false
    disabledByDefault: PropTypes.bool,
        // Show week numbers. Default = false
    showWeekNumbers: PropTypes.bool,
        // hidden head titile. Default = false
    hiddenHeader: PropTypes.bool,
        // selected week color
    selectedColor: PropTypes.any,
        // 是否只标记今天所在周，默认为false
    onlyMarkTodayWeek: PropTypes.bool,
        // 是否禁止滑动切换周/月显示样式
    disabledSwitchMode: PropTypes.bool,
        // 是否是日期，如果是日期则按照租户时区进行时间格式化，否则按照个人时区
    isDate: PropTypes.bool,
  };

  thresholdX = 40;
  thresholdY = 20;
  constructor(props) {
    super(props);
    this.style = styleConstructor(this.props.theme);
    let currentDay;
    if (props.current) {
      currentDay = parseDate(props.current, this.props.isDate);
    } else {
      currentDay = TimeUtils.now(this.props.isDate ? zoneConfig.systemZone : zoneConfig.timezone);
    }
    this.animating = false;
    this.state = {
      currentDay,
      mode: MODE.MONTH,
    };

    this.updateMonth = this.updateMonth.bind(this);
    this.addMonth = this.addMonth.bind(this);
    this.pressDay = this.pressDay.bind(this);
    this.shouldComponentUpdate = shouldComponentUpdate;
  }

  UNSAFE_componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gs) => this.handleOnMoveShouldSetPanResponder(e, gs),
      onPanResponderMove: (e, gs) => this.handlePanResponderMove(e, gs),
      onShouldBlockNativeResponder: _ => false,
    });
  }

  handleOnMoveShouldSetPanResponder(e, gs) {
    const { dx, dy } = gs;
    return Math.abs(dx) > this.thresholdX || Math.abs(dy) > this.thresholdY;
  }

  handlePanResponderMove(e, gestureState) {
    const { dx, dy } = gestureState;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

        // 移动距离大于阈值时，才开始处理滑动逻辑
    if (!this.animating && (absDx > this.thresholdX || absDy > this.thresholdY)) {
      this.animating = true;
            // 竖向滑动
      if (absDy > absDx) {
        if (dy > 0 && this.state.mode === MODE.WEEK) {
          this.tirgger();
        } else if (dy < 0 && this.state.mode === MODE.MONTH) {
          this.tirgger();
        }
      } else {
                // 横向滑动
        this.addMonth(dx > 0 ? -1 : 1);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const current= parseDate(nextProps.current);
    if (current && current.format('YYYY MM') !== this.state.currentDay.format('YYYY MM')) {
      const currentDay = current.clone();
      this.setState({
        currentDay,
      });
    }
  }

  UNSAFE_componentWillUpdate(){
    LayoutAnimation.configureNext({
      duration: 250,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear
      }
    });
  }

  updateMonth(day, doNotTriggerListeners) {
    if (day.format('YYYY MM') === this.state.currentDay.format('YYYY MM')) {
      return;
    }
    const currentDay = day.clone();
    this.setState({
      currentDay,
    }, () => {
      if (!doNotTriggerListeners) {
        const currMont = this.state.currentDay.clone();
        if (this.props.onMonthChange) {
          this.props.onMonthChange(xdateToData(currMont, this.props.isDate));
        }
        if (this.props.onVisibleMonthsChange) {
          this.props.onVisibleMonthsChange([xdateToData(currMont, this.props.isDate)]);
        }
      }
    });
  }

  updateWeek(day, doNotTriggerListeners) {
    const currentDay = day.clone();
    this.setState({
      currentDay,
    }, () => {
      if (!doNotTriggerListeners) {
        const currMont = this.state.currentDay.clone();
        if (this.props.onMonthChange) {
          this.props.onMonthChange(xdateToData(currMont, this.props.isDate));
        }
        if (this.props.onVisibleMonthsChange) {
          this.props.onVisibleMonthsChange([xdateToData(currMont, this.props.isDate)]);
        }
      }
    });
  }

  pressDay(date) {
    const day = parseDate(date, this.props.isDate);
    const minDate = parseDate(this.props.minDate, this.props.isDate);
    const maxDate = parseDate(this.props.maxDate, this.props.isDate);
    this.setState({currentDay:day});
    if (!(minDate && !dateutils.isGTE(day, minDate)) && !(maxDate && !dateutils.isLTE(day, maxDate))) {
      const shouldUpdateMonth = this.props.disableMonthChange === undefined || !this.props.disableMonthChange;
      if (shouldUpdateMonth) {
        this.updateMonth(day);
      }
      if (this.props.onDayPress) {
        this.props.onDayPress(xdateToData(day, this.props.isDate));
      }
    }
  }

  addMonth(count) {
    this.changeAnimate(count);
    if (this.state.mode === MODE.MONTH){
      this.updateMonth(this.state.currentDay.clone().add(count, 'month'));
    } else {
      this.updateWeek(this.state.currentDay.clone().add(count, 'week'));
    }
  }

  changeAnimate() {
    InteractionManager.runAfterInteractions(()=>{
      this.animating = false;
    });
  }

  renderDay(day, id) {
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    let state = '';
    if (this.props.disabledByDefault) {
      state = 'disabled';
    } else if ((minDate && !dateutils.isGTE(day, minDate)) || (maxDate && !dateutils.isLTE(day, maxDate))) {
      state = 'disabled';
    } else if (this.state.mode === MODE.MONTH && !dateutils.sameMonth(day, this.state.currentDay)) {
      state = 'disabled';
    } else if (dateutils.sameDate(day, TimeUtils.now(this.props.isDate ? zoneConfig.systemZone : zoneConfig.timezone))) {
      state = 'today';
    }
    let dayComp;
    if (this.state.mode === MODE.MONTH && !dateutils.sameMonth(day, this.state.currentDay) && this.props.hideExtraDays) {
      if (this.props.markingType === 'period') {
        dayComp = (<View key={id} style={{flex: 1}}/>);
      } else {
        dayComp = (
                    <View key={id} style={{ width: this.props.emptyDayWidth || 24 }} />
                );
      }
    } else {
      const DayComp = this.getDayComponent();
      const date = day.getDate();
      dayComp = (
                <DayComp
                    key={id}
                    state={state}
                    theme={this.props.theme}
                    onPress={this.pressDay}
                    date={xdateToData(day, this.props.isDate)}
                    marking={this.getDateMarking(day)}
                >
                    {date}
                </DayComp>
            );
    }
    return dayComp;
  }

  getDayComponent() {
    if (this.props.dayComponent) {
      return this.props.dayComponent;
    }

    switch (this.props.markingType) {
    case 'period':
      return UnitDay;
    case 'multi-dot':
      return MultiDotDay;
    default:
      return Day;
    }
  }

  getDateMarking(day) {
    if (!this.props.markedDates) {
      return false;
    }
    const dates = this.props.markedDates[day.format('YYYY-MM-DD')] || EmptyArray;
    if (dates.length || dates) {
      return dates;
    } else {
      return false;
    }
  }

  renderWeekNumber (weekNumber) {
    return <Day key={`week-${weekNumber}`} theme={this.props.theme} state='disabled'>{weekNumber}</Day>;
  }

  renderWeek(days, id) {
    const week = [];
    days.forEach((day, id2) => {
      if (day.getDate() === this.state.currentDay.getDate()){
        this.currentWeek = id;
      }
      week.push(this.renderDay(day, id2));
    }, this);

    if (this.props.showWeekNumbers) {
      week.unshift(this.renderWeekNumber(days[days.length - 1].getWeek()));
    }

    return (
            <View
                style={[this.style.week]}
                key={id}
            >
                {week}
            </View>
    );
  }

  tirgger = () =>{
    if (!this.props.disabledSwitchMode) {
      if (this.state.mode === MODE.MONTH){
        this.setState({mode:MODE.WEEK});
      } else {
        this.setState({mode:MODE.MONTH});
      }
    }
    InteractionManager.runAfterInteractions(()=>{
      this.animating = false;
    });
  };

  render() {
    let getDays = this.state.mode === MODE.MONTH ? dateutils.page : dateutils.week;
    const days = getDays(this.state.currentDay, this.props.firstDay);
    const weeks = [];
    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }
    let indicator;
    const current = parseDate(this.props.current);
    if (current) {
      const lastMonthOfDay = current.clone().add(1, 'month').date(1).add(-1, 'day').format('YYYY-MM-DD');
      if (this.props.displayLoadingIndicator &&
                !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])) {
        indicator = true;
      }
    }
    return (
            <View
                style={[this.style.container, this.props.style]}
                {...this._panResponder.panHandlers}
            >
                <CalendarHeader
                    mode={this.state.mode}
                    theme={this.props.theme}
                    onlyMarkTodayWeek={this.props.onlyMarkTodayWeek}
                    hideArrows={true}
                    month={this.state.currentDay}
                    currentDay={this.state.currentDay}
                    addMonth={this.addMonth}
                    showIndicator={indicator}
                    firstDay={this.props.firstDay}
                    pressDay={this.pressDay}
                    renderArrow={this.props.renderArrow}
                    monthFormat={this.props.monthFormat}
                    hideDayNames={this.props.hideDayNames}
                    weekNumbers={this.props.showWeekNumbers}
                    hiddenHeader={this.props.hiddenHeader}
                    selectedColor={this.props.selectedColor}
                    isDate={this.props.isDate}
                />
                <View>
                    {weeks}
                </View>
            </View>);
  }
}

export default Calendar;
