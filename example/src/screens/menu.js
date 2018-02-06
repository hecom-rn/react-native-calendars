import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default class MenuScreen extends Component {

  render() {
    return (
      <View>
        <TouchableOpacity style={styles.menu} onPress={this.onCalendarsPress.bind(this)}>
          <Text style={styles.menuText}>Calendars</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={this.onCalendarListPress.bind(this)}>
          <Text style={styles.menuText}>Calendar List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={this.onAgendaPress.bind(this)}>
          <Text style={styles.menuText}>Agenda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={this.onTestCalendarsPress.bind(this)}>
          <Text style={styles.menuText}>TestCalendar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onTestCalendarsPress() {
    this.props.navigator.push({
      screen: 'TestCalendar',
      title: 'TCalendars'
    });
  }
  onCalendarsPress() {
    this.props.navigator.push({
      screen: 'Calendars',
      title: 'Calendars'
    });
  }

  onCalendarListPress() {
    this.props.navigator.push({
      screen: 'CalendarsList',
      title: 'Calendar List'
    });
  }

  onAgendaPress() {
    this.props.navigator.push({
      screen: 'Agenda',
      title: 'Agenda'
    });
  }
}

const styles = StyleSheet.create({
  menu: {
    height: 50,
    justifyContent: 'center',
    paddingLeft: 15,
    borderBottomWidth: 1
  },
  menuText: {
    fontSize: 18
  }
});