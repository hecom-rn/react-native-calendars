import {Navigation} from 'react-native-navigation';

import MenuScreen from './menu';
import CalendarsScreen from './calendars';
import AgendaScreen from './agenda';
import CalendarsList from './calendarsList';
import TestCalendar from './TestCalendar';

export function registerScreens() {
  Navigation.registerComponent('Menu', () => MenuScreen);
  Navigation.registerComponent('Calendars', () => CalendarsScreen);
  Navigation.registerComponent('Agenda', () => AgendaScreen);
  Navigation.registerComponent('CalendarsList', () => CalendarsList);
  Navigation.registerComponent('TestCalendar', () => TestCalendar);
}
