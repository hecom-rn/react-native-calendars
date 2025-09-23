import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { TimeUtils, TimeInstance } from '@hecom/aDate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import { weekDayNames } from '../../dateutils';
import {zoneConfig} from '@hecom/aDate/config';

class CalendarHeader extends Component {
  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(TimeInstance),
    currentDay: PropTypes.instanceOf(TimeInstance),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    hiddenHeader: PropTypes.bool,
    selectedColor: PropTypes.any,
    // 是否只标记今天所在周，默认为false
    onlyMarkTodayWeek: PropTypes.bool,
    isDate: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.today = TimeUtils.now(props.isDate ? zoneConfig.systemZone : zoneConfig.timezone);
  }

  isSameDay(selected) {
    return this.today.getYear(this.props.isDate) === selected.getYear(this.props.isDate) && this.today.getMonth(this.props.isDate) === selected.getMonth(this.props.isDate)
        && this.today.getDate(this.props.isDate) === selected.getDate(this.props.isDate);
  }

  isSameWeek(selected) {
    return this.today.getYear(this.props.isDate) === selected.getYear(this.props.isDate) && this.today.getMonth(this.props.isDate) === selected.getMonth(this.props.isDate)
        && this.today.getDate(this.props.isDate) === selected.getDate(this.props.isDate);
  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.month.format('YYYY MM') !==
      this.props.month.format('YYYY MM')
    ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true;
    }
    if (nextProps.currentDay !== this.props.currentDay) {
      return true;
    }
    if (nextProps.mode !== this.props.mode) {
      return true;
    }
    return false;
  }

  render() {
    let leftArrow = <View />;
    let rightArrow = <View />;
    let weekDaysNames = weekDayNames(this.props.firstDay);
    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity
          onPress={this.substractMonth}
          style={this.style.arrow}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('left')
            : <Image
                source={require('../img/previous.png')}
                style={this.style.arrowImage}
              />}
        </TouchableOpacity>
      );
      rightArrow = (
        <TouchableOpacity onPress={this.addMonth} style={this.style.arrow}>
          {this.props.renderArrow
            ? this.props.renderArrow('right')
            : <Image
                source={require('../img/next.png')}
                style={this.style.arrowImage}
              />}
        </TouchableOpacity>
      );
    }
    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator />;
    }
    let today;
    if (!this.isSameDay(this.props.currentDay)) {
      today = <TouchableOpacity
          style={{position:'absolute', right: 16, alignSelf:'center'}}
          onPress={()=>this.props.pressDay(this.today)}>
          <Text style={this.style.today}>今日</Text>
      </TouchableOpacity>;
    }
    return (
      <View>
        {!this.props.hiddenHeader &&
          <View style={this.style.header}>
            {/* {leftArrow} */}
            <View style={{ flexDirection: 'row' }}>
              <Text allowFontScaling={undefined} style={this.style.monthText}>
                {this.props.month.format(this.props.monthFormat ? this.props.monthFormat : 'MMMM YYYY')}
              </Text>
              {indicator}
            </View>
            {today}
            {/* {rightArrow} */}
          </View>
        }
        {
          !this.props.hideDayNames &&
          <View style={this.style.week}>
            {this.props.weekNumbers && <Text allowFontScaling={undefined} style={this.style.dayHeader}></Text>}
            {weekDaysNames.map((day, idx) => (
              <Text allowFontScaling={undefined}
                key={idx}
                style={(this.isSelectedWeek(idx) && this.props.selectedColor) ? [this.style.dayHeader, {color: this.props.selectedColor}] : this.style.dayHeader}
                numberOfLines={1}>
                  {day}
                </Text>
            ))}
          </View>
        }
      </View>
    );
  }

  isSelectedWeek = (index) => {
    const g = this.props.onlyMarkTodayWeek ? this.today.getDay(this.props.isDate) : this.props.currentDay.getDay(this.props.isDate);
    const f = this.props.firstDay;
    const sameMonth = this.props.onlyMarkTodayWeek ? this.today?.format?.('YYYY-MM') == this.props?.month?.format?.('YYYY-MM') : true;
    return ((index + f) === g || g + (7 - f) === index) && sameMonth;
  }
}

export default CalendarHeader;
